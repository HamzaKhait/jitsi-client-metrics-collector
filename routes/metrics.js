const appConfig = require('../config/app-config');

var express = require('express');
var router = express.Router();
var uaParser = require("ua-parser-js")
var path = require("path");
var fs = require("fs");

//user-agent parser
var parser = require('ua-parser-js');


// Prometheus
var prom_client = require('prom-client');
var prom_registry = prom_client.register;


var redis = require('redis');
const redisClient = redis.createClient({
  url:  appConfig.REDIS_URL
});
redisClient.connect();

// Handle Redis client errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});
// Handle Redis clientc connect
redisClient.on('connect', (err) => {
  console.log('Connected to redis.');
});

// Helpers
var schema_validator = require("../helpers/jcmc-schema-validator")();
var jcmcToProm = require('../helpers/jcmc-to-prom');
jcmcToProm.buildMetrics(prom_client);

const { removeLabels } = require('prom-client/lib/util');
const { Console } = require('console');
const appConfig = require('../config/app-config');

setInterval(async () => {
  let all_current_metrics = await prom_registry.getMetricsAsArray();
  let namesAndLabels = {};
  for (let metric of all_current_metrics) {
    if (Object.keys(metric.hashMap).length > 0){
      for (let key in metric.hashMap) {
        if (!namesAndLabels[metric.name]){
          namesAndLabels[metric.name] = [];
        }
        namesAndLabels[metric.name].push(metric.hashMap[key].labels);
      }
    }
  }

  if (Object.keys(namesAndLabels).length > 0) {
    for (let key in namesAndLabels){
      for (let labelGroup of namesAndLabels[key]){
        let metricFromRedis = await redisClient.get('lastPush_'+labelGroup.client_id+'_'+labelGroup.participant_id);
        if (!metricFromRedis){
          prom_registry.getSingleMetric(key).remove(labelGroup);
          console.log(`Metric ${key} with labels ${JSON.stringify(labelGroup)} is expired and then removed`)
        }
      }
    }  
  }
}, appConfig.METRICS_EXPIRATION_CHECK*1000); // Expiration check in ms


router.get('/', async (req, res) => {
  let metrics = await prom_registry.metrics();
  res.status(200).send(metrics); 
})

router.post('/push', async (req, res) => {
  var received_metrics = req.body;

  var validation = schema_validator.validate(received_metrics, { abortEarly: false });

  if(validation.error){
    console.log(validation.error.details);
    return res.status(400).send(JSON.stringify(validation.error.details));
  }
  else{

    //append browser info to request
    var received_connectionquality = received_metrics.metrics.connectionquality || null;
    if (received_connectionquality){
      var ua = uaParser(req.headers['user-agent']);
      received_connectionquality.labels = {
        ...received_connectionquality.labels,
        browser_name : ua.browser.name,
        browser_version : ua.browser.version,
        os_name : ua.os.name,
        os_version : ua.os.version
      }
    }

    await redisClient.set(
      'lastPush_'+received_metrics.default_labels.client_id+'_'+received_metrics.default_labels.participant_id,
      Math.floor(Date.now() / 1000),{
        EX : appConfig.METRICS_EXPIRATION
      }
    );

    let transformed_metrics = jcmcToProm.transformJsonMetrics(received_metrics);

    for (const key in transformed_metrics) {
          prom_registry.getSingleMetric(key).labels(transformed_metrics[key].labels).set(transformed_metrics[key].value);
      }

    res.status(200).send("OK"); 
  }

});

module.exports = router;
