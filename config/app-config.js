//Conversion tools
let toBool = (string) => (string === "true" ? true : false); //string to bool

const appConfig = {
  REDIS_URL : process.env.REDIS_URL || "redis://127.0.0.1:6379",
  METRICS_EXPIRATION_CHECK: parseInt(process.env.METRICS_EXPIRATION_TOLERANCE) || 10,
  METRICS_EXPIRATION: parseInt(process.env.METRICS_EXPIRATION) || 30
};

module.exports = appConfig;
