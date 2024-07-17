// URL where data is sent
const jcmc_push_url = 'http://127.0.0.1:3000/metrics/push'; //this value is generated dynamically by the backend

// Function that returns clientID from local storage
// If variable doesn't exist, it creates one and then returns it
function getStaticId() {
    var staticId = localStorage.getItem('jmmc_staticUserId');
    if (!staticId) {
      // https://stackoverflow.com/a/2117523
      staticId = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16),
      );
      localStorage.setItem('jmmc_staticUserId', staticId);
    }
    return staticId;
}

function formatJitsiMetrics(JitsiMetrics) {
    var _client_id = getStaticId() || "";
    var _participant_id = APP.conference.getMyUserId();
    var _roomname = APP.conference.roomName || "";

    return {
        default_labels : {
            client_id : _client_id,
            participant_id : _participant_id,
            roomname : _roomname
        },
        metrics : {
            connectionquality : {
                labels : {
                    serverregion : JitsiMetrics.serverRegion || ""
                    // video_codec :  , //TODO handle screen sharing
                    // audio_codec : ,  //TODO handle screen sharing
                    // screensharing_video_codec : , //TODO handle screen sharing
                    // screensharing_audio_codec : , //TODO handle screen sharing
                },
                value : JitsiMetrics.connectionQuality || null,
            },
            bandwidth_upload : {
                value : JitsiMetrics.bandwidth.upload || null,
            },
            bandwidth_download : {
                value : JitsiMetrics.bandwidth.download || null,
            },
            bitrate_audio_upload : {
                value : JitsiMetrics.bitrate.audio.upload || null,
            },
            bitrate_audio_download : {
                value : JitsiMetrics.bitrate.audio.download || null,
            },
            bitrate_video_upload : {
                value : JitsiMetrics.bitrate.video.upload || null,
            },
            bitrate_video_download : {
                value : JitsiMetrics.bitrate.video.download || null,
            },
            bitrate_download : {
                value : JitsiMetrics.bitrate.download || null,
            },
            bitrate_upload : {
                value : JitsiMetrics.bitrate.upload || null, //if >JitsiMetrics.bitrate.video.upload then user is screensharing //TODO handle screensharing
            },
            // framerate : {
            //     value : JitsiMetrics.framerate[participant_id] || null, //TODO handle screen sharing by selecting ssrc
            // },
            // resolution_height : {
            //     value : JitsiMetrics.resolution[participant_id][0].height || null, //TODO handle screen sharing by selecting ssrc
            // },
            // resolution_width : {
            //     value : JitsiMetrics.resolution[participant_id][0].width || null, //TODO handle screen sharing by selecting ssrc
            // },        
            packetloss_upload : {
                value : JitsiMetrics.packetLoss.upload || null,
            },
            packetloss_download : {
                value : JitsiMetrics.packetLoss.download || null,
            },
            packetloss_total : {
                value : JitsiMetrics.packetLoss.total || null,
            },
            transport_rtt : {
                labels:{
                    src_ip : JitsiMetrics.transport[0].localip.split(':')[0],
                    dst_ip :JitsiMetrics.transport[0].ip.split(':')[0],
                    protocol : JitsiMetrics.transport[0].type,
                    networkType : JitsiMetrics.transport[0].networkType
                },
                value : JitsiMetrics.transport[0].rtt || null,
            }    
        }
    };
}

function pushMetrics(jitsiStats){
    fetch(jcmc_push_url,{
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(formatJitsiMetrics(jitsiStats)),
    })
    .then(response => {
        console.log('Status:', response.status);
        return response; // or response.text() for plain text responses
    })
    .then(data => {
        console.log('Data:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function RunJCMC() {
    var local_stats_updated_event = "cq.local_stats_updated";
    APP.conference._room.on(local_stats_updated_event, (jitsiStats) => pushMetrics(jitsiStats))
}

// wait for Jitsi
function waitForJitsiAPP() {
    const interval = setInterval(() => {
        if (typeof APP !== 'undefined' 
            && typeof APP.conference !== 'undefined' 
            && typeof APP.conference._room !== 'undefined') {
            clearInterval(interval);
            console.log("APP.conference._room variable is defined and ready to be used.");
            RunJCMC();
        }
        else {
            console.log("Waiting for APP.conference._room variable to be defined...");
        }
    }, 2000); // check every second
}

waitForJitsiAPP();
