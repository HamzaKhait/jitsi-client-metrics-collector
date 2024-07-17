const appConfig = require('../config/app-config');

const metricsConfig = {}


metricsConfig.default_labels = [
    'client_id',
    'participant_id',
    'roomname'
]

metricsConfig.metrics = [
    {
        type : "gauge",
        name: 'connectionquality',
        help : "Connection Quality",
        labels : ['browser_name', 'browser_version', 'os_name' ,'os_version','serverregion']
    },
    {
        type : "gauge",
        name: 'bandwidth_upload',
        help : "bandwidth_upload",
        labels : []
    },
    {
        type : "gauge",
        name: 'bandwidth_download',
        help : "bandwidth_download",
        labels : []
    },
    {
        type : "gauge",
        name: 'bitrate_audio_upload',
        help : "bitrate_audio_upload",
        labels : []
    },
    {
        type : "gauge",
        name: 'bitrate_audio_download',
        help : "bitrate_audio_download",
        labels : []
    },
    {
        type : "gauge",
        name: 'bitrate_video_upload',
        help : "bitrate_video_upload",
        labels : []
    },
    {
        type : "gauge",
        name: 'bitrate_video_download',
        help : "bitrate_video_download",
        labels : []
    },
    {
        type : "gauge",
        name: 'bitrate_download',
        help : "bitrate_download",
        labels : []
    },
    {
        type : "gauge",
        name: 'bitrate_upload',
        help : "bitrate_upload",
        labels : []
    },
    {
        type : "gauge",
        name: 'packetloss_upload',
        help : "packetloss_upload",
        labels : []
    },
    {
        type : "gauge",
        name: 'packetloss_download',
        help : "packetloss_download",
        labels : []
    },
    {
        type : "gauge",
        name: 'packetloss_total',
        help : "packetloss_total",
        labels : []
    },
    {
        type : "gauge",
        name: 'transport_rtt',
        help : "transport_rtt",
        labels : ['src_ip','dst_ip','protocol','networkType']
    }
]

module.exports = metricsConfig;
