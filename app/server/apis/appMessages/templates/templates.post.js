var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);


post.validate = function () {
    return function (req, res, next) {
        let COMMON = req.meta.std.common;

        if (req.body.title !== undefined) {
            req.check('title','400_8').len(COMMON.minLength, COMMON.maxLength);
        }
        if (req.body.body !== undefined) {
            req.check('body','400_8').len(COMMON.minLength, COMMON.maxLength);
        }
        req.utils.common.checkError(req, res, next);
        console.log('id');
    };
};

post.setParam = function () {
    return function (req, res, next) {
        console.log('\npost req.body: ', req.body, '\n');
        req.models.AppTemplate.createTemplate(req.body, (status, data) => {
            if (status == 201) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

post.sendMessage = function() {
    return function (req, res, next) {
        var from  = req.body.from ;
        var to = req.body.to;
        var message = req.body.body;
        var NOTIFICATION_UTIL = req.appUtils.notification;

        NOTIFICATION_UTIL.sendSms(req, from , to, message, function(status, data){
            console.log(status, data);
            if(status == 200){
                next();
            }
            else{
                return res.hjson(req, next, 400, data);
            }
        })

    }
};

post.supplement = function () {
    return function (req, res, next) {
        return res.hjson(req, next, 201, req.data);
    };
};

module.exports = post;
