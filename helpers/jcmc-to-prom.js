const appConfig = require('../config/app-config');


var metricsConfig = require('../config/metrics-config');

var jcmcToProm = {};

jcmcToProm.buildMetrics = function(prom_client) {
    for (const metric of metricsConfig.metrics) {
        if(metric.type === 'gauge'){
            let newGauge = new prom_client.Gauge({
                name: metricsConfig.prefix + metric.name,
                help: metric.help,
                labelNames: [...metricsConfig.default_labels, ...metric.labels]
              });
            console.log(`Creating new metric for prometheus : ${metric.name}`);
        }
        //TODO later handel other types of metrics
      }      
}

jcmcToProm.transformJsonMetrics = function(jsonMetrics){
    let transformed_metrics = {};
    Object.keys(jsonMetrics.metrics).forEach(key => {
        if(jsonMetrics.metrics[key].value != null){ //exclude null values from the transformed metrics because null is not supported by Promtheus
            transformed_metrics[key] = {
                labels : {...jsonMetrics.default_labels, ...jsonMetrics.metrics[key].labels},
                value : jsonMetrics.metrics[key].value
            }
        }
      });
    return transformed_metrics;
}

module.exports = jcmcToProm;
