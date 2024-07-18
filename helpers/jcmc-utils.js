var jcmcUtils = {};

jcmcUtils.isPrivateIP = function(ip) {
    // Regular expressions for different private IP ranges
    const privateIPRegexes = [
      /^10\.(?:\d{1,3}\.){2}\d{1,3}$/,      // 10.0.0.0 - 10.255.255.255
      /^172\.(?:1[6-9]|2\d|3[01])\.(?:\d{1,3}\.){1}\d{1,3}$/,   // 172.16.0.0 - 172.31.255.255
      /^192\.168\.(?:\d{1,3}\.){1}\d{1,3}$/,        // 192.168.0.0 - 192.168.255.255
      /^127\.0\.0\.1$/      // 127.0.0.1 (loopback address)
    ];
  
    // Check if the IP matches any of the private IP ranges
    for (let regex of privateIPRegexes) {
      if (regex.test(ip)) {
        return true;
      }
    }
    return false;
  }

module.exports = jcmcUtils;
