var post = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);


post.validate = function () {
    return function (req, res, next) {
        var STOCK = req.meta.std.stock;

        // req.check('id', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
    };
};

post.setParam = function () {
    return function (req, res, next) {
        // var instance = req.models.AppMessage.build(body);
        // req.appUtils.exports
        req.models.AppMessage.createMessage(req.body, (status, data) => {
            if (status == 201) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
        // req.models.AppMessage.createMessage(body, function (status, data) {
        //     if (status == 200) {
        //         req.instance = data;
        //         console.log('req.instance : ', req.instance);
        //         next();
        //     } else {
        //         return res.hjson(req, next, status, data);
        //     }
        // });
    };
};


post.sendMessage = function() {
    return function (req, res, next) {
        var from  = req.body.from ;
        var to = req.body.to;
        var message = req.body.body;
        var type = 'sms';
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
