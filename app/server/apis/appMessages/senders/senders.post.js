var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
var COMMONAPP = require('../../../config/env/common');


post.validate = function () {
    return function (req, res, next) {
        let COMMON = req.meta.std.common;
        // req.check('id', '400_12').isInt();

        if (req.body.senderId !== undefined) {
            req.check('senderId','400_8').len(COMMON.minLength, COMMON.maxLength);
        }
        if (req.body.templateId !== undefined) {
            req.check('templateId','400_8').len(COMMON.minLength, COMMON.maxLength);
        }
        if (req.body.receiver !== undefined) {
            req.check('receiver','400_8').len(COMMON.minLength, COMMON.maxLength);
        }
        req.utils.common.checkError(req, res, next);
        console.log('id');
    };
};

post.setParam = function () {
    return function (req, res, next) {
        req.models.AppSender.createSender(req.body, (status, data) => {
            if (status == 201) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.getTemplateBody = function () {
    return function (req, res, next) {
        req.models.AppTemplate.findOne({
            where: {
                id: req.data.templateId
            }
        }).then((data) => {
            if (data) {
                req.data.template = data.dataValues;
                next();
            } else {
                return res.hjson(req, next, 404, data)
            }
        })
    }
}

post.sendMessage = function() {
    return function (req, res, next) {
        var sender = COMMONAPP.sender.apiStoreSMS.from;
        var receiver = req.body.receiver;
        var message = req.data.template.body;
        var NOTIFICATION_UTIL = req.appUtils.notification;

        NOTIFICATION_UTIL.sendSms(req, sender, receiver, message, function(status, data){
            console.log('After NOTIFICATION : \n',status, data);
            if (status == 200){
                // add sendcount success count
                next();
            }
            else{
                // add sendcount only.
                return res.hjson(req, next, 400, data);
            }
        })

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
