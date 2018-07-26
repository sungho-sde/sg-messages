var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var COMMONAPP = require('../../../config/env/common');
var async = require('async');

post.validate = function () {
    return function (req, res, next) {
        let COMMON = req.meta.std.common;

        req.check('senderId','400_8').len(COMMON.minLength, COMMON.maxLength);
        req.check('templateId','400_8').len(COMMON.minLength, COMMON.maxLength);
        req.utils.common.toArray(req.body, 'receivers');

        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        var receivers = [];
        req.body.receivers.forEach(function (receiver) {
            receivers.push({
                receiver: receiver
            });
        });
        req.body.receivers = receivers;

        var include = req.models.AppSender.getIncludeSender();
        req.models.AppSender.createDataIncluding(req.body, include, function (status, data) {
            if (status == 201) {
                data.reload().then(function (data) {
                    req.data = data;
                    next();
                });
            } else {
                res.hjson(req, next, status, data);
            }
        });
    };
};


//
// post.setParam = function () {
//     return function (req, res, next) {
//         req.models.AppSender.createSender(req.body, (status, data) => {
//             if (status == 201) {
//                 req.data = data;
//                 next();
//             } else {
//                 return res.hjson(req, next, status, data);
//             }
//         });
//     };
// };
//
// post.getTemplateBody = function () {
//     return function (req, res, next) {
//         req.models.AppTemplate.findOne({
//             where: {
//                 id: req.data.templateId
//             }
//         }).then((data) => {
//             if (data) {
//                 req.data.template = data.dataValues;
//                 next();
//             } else {
//                 return res.hjson(req, next, 404, data)
//             }
//         })
//     }
// }

post.sendMessage = function() {
    return function (req, res, next) {
        var sender = COMMONAPP.sender.apiStoreSMS.from;
        var message = req.data.template.body;
        var NOTIFICATION_UTIL = req.appUtils.notification;

        var funcs = [];

        for (var i=0; i<req.data.receivers.length; i++) {
            (function (receiver) {
                funcs.push(function (subCallback) {
                    NOTIFICATION_UTIL.sendSms(req, sender, receiver, message, function(status, data){
                        console.log('After NOTIFICATION : \n',status, data);
                        if (status == 200){
                            subCallback(null, true);
                        } else {
                            subCallback({
                                status: status,
                                data: data
                            }, false);
                        }
                    });
                });

            })(req.data.receivers[i].receiver);
        }

        next();

        async.series(funcs, function (error, results) {

            if (error) {
                console.error(error.status, error.data);
            } else {
                console.log("success");
            }
        });


    }
};
post.setSenderHistory = function () {
    return function (req, res, next) {
        data = req.data.datavalues;
        body = {
            'senderId': data.senderId,
            'templateId': data.templateId,

        }


        req.models.AppTemplate.createSenderHistory(req.body, (status, data) => {
            if (status == 201) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};


post.supplement = function () {
    return function (req, res, next) {
        return res.hjson(req, next, 201, req.data);
    };
};

module.exports = post;
