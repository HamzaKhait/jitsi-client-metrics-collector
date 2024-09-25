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
        //TODO later handle other types of metrics
      }      
}

jcmcToProm.transformJsonMetrics = function(jsonMetrics){
    let transformed_metrics = {};

    Object.keys(jsonMetrics.metrics).forEach(key => {
        let keyWithPrefix = metricsConfig.prefix+key;

        if(Array.isArray(jsonMetrics.metrics[key])){ // When it's an array of metrics, it means that it's the same metric but with different labels
            transformed_metrics[keyWithPrefix] = jsonMetrics.metrics[key].map(item =>({
                labels : {...jsonMetrics.default_labels, ...item.labels},
                value : item.value
            })).filter( (item) => item.value != null);
        }
        
        else if(jsonMetrics.metrics[key].value != null){ //exclude null values from the transformed metrics because null is not supported by Promtheus
            transformed_metrics[keyWithPrefix] = {
                labels : {...jsonMetrics.default_labels, ...jsonMetrics.metrics[key].labels},
                value : jsonMetrics.metrics[key].value
            }
        }
      });

    return transformed_metrics;
}

module.exports = jcmcToProm;
