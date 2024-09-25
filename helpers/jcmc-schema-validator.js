const appConfig = require('../config/app-config');

var Joi = require('joi');

var validator = () => {
    var schema_validator = Joi.object({
        default_labels : Joi.object({
            client_id: Joi.string().guid({separator:'-'}).required(),
            participant_id : Joi.string().required(),
            roomname : Joi.string().required()
        }).required(),
        metrics : {
            connectionquality : Joi.object({
                labels : Joi.object({
                    serverregion : Joi.string().allow('')
                }),
                value : Joi.number().ruleset.min(0).max(100).allow(null)
            }),
            bandwidth_upload : Joi.object({
                value : Joi.number().allow(null),
            }),
            bandwidth_download : Joi.object({
                value : Joi.number().allow(null),
            }),
            bitrate_audio_upload : Joi.object({
                value : Joi.number().allow(null),
            }),
            bitrate_audio_download : Joi.object({
                value : Joi.number().allow(null),
            }),
            bitrate_video_upload : Joi.object({
                value : Joi.number().allow(null),
            }),
            bitrate_video_download : Joi.object({
                value : Joi.number().allow(null),
            }),
            bitrate_download : Joi.object({
                value : Joi.number().allow(null),
            }),
            bitrate_upload : Joi.object({
                value : Joi.number().allow(null),
            }),
            packetloss_upload : Joi.object({
                value : Joi.number().allow(null),
            }),
            packetloss_download : Joi.object({
                value : Joi.number().allow(null),
            }),
            packetloss_total : Joi.object({
                value : Joi.number().allow(null),
            }),
            transport_rtt: Joi.array().items(
                Joi.object({
                    labels : {
                        src_ip : Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' }),
                        dst_ip : Joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' }),
                        protocol : Joi.string().valid('tcp', 'udp'),
                        networkType : Joi.string().allow('') //TODO Enhance verification
                    },
                    value : Joi.number().allow(null),
                })
            )
        }
        
        // {

        // uid: Joi.string().guid().required(),
        // conf: Joi.string().pattern(validatorConfig.confPattern).required(),

        // m: Joi.object({
        //     br: // browser_name
        //     Joi.string(),  
        //     os: // operating_system
        //     Joi.string(),
        //     pid: // operating_system
        //     Joi.string().required(),
        //     cq: // connection_quality
        //     Joi.number().min(0).max(100), 
        //     res: // resolution
        //     Joi.object({h: Joi.number(), w: Joi.number()}), 
        //     cdc: // codec
        //     Joi.object({a: Joi.string(), v: Joi.string()}),  
        //     u: // upload metrics
        //     Joi.object({ 
        //         bw: // upload bandwidth
        //         Joi.number(),   
        //         ab: // upload audio_bitrate
        //         Joi.number(),   
        //         vb: // upload video_bitrate
        //         Joi.number(),   
        //         pl: // upload packet_loss
        //         Joi.number()    
        //     }),
        //     d: //download metrics
        //     Joi.object({
        //         bw: // download bandwidth
        //         Joi.number().optional().allow(null), 
        //         ab: // download audio_bitrate
        //         Joi.number(),   
        //         vb: // download video_bitrate
        //         Joi.number(),   
        //         pl: // download packet_loss
        //         Joi.number()    
        //     }),
        //     t: // transport metrics
        //     Joi.object({ 
        //         ip: // transport ip
        //         Joi.number(), 
        //         p: // transport port
        //         Joi.number(),            
        //         tp: // transport type
        //         Joi.string().valid('tcp', 'udp'), 
        //         lip: // transport local_ip
        //         Joi.number(),
        //         rip: // transport real_ip
        //         Joi.number(),
        //         lp: // transport local_port
        //         Joi.number(),
        //         sr: // server_region
        //         Joi.string().valid(...validatorConfig.authorizedRegions)                        
        //     }),
        //     ts: //timestamp
        //     Joi.number().required()
        // }).min(2).required()
    });
    return schema_validator;
}


module.exports = validator;