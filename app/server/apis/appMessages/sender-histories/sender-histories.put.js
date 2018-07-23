var put = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);
const CONFIG = require('../../../../../bridge/config/env');
const STD = require('../../../../../bridge/metadata/standards');

put.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();

        let COMMON = req.meta.std.common;

        if (req.body.senderId !== undefined) {
            req.check('title','400_8').len(COMMON.minLength, COMMON.maxLength);
        }
        if (req.body.sendCount !== undefined) {
            req.check('sendCount','400_5').isInt();
        }
        if (req.body.successCount !== undefined) {
            req.check('successCount','400_5').isInt();
        }
        req.utils.common.checkError(req, res, next);
    };
};

put.find = function () {
    return function (req, res, next) {
        req.models.AppSenderHistory.findOne({
            where: {
                id: req.params.id
            }
        }).then((data) =>{
            if (data) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, 404, data)
            }
        })
    };
};

put.update = function () {
    return function (req, res, next) {

        let options = {};

        if (req.body.senderId !== undefined) {
            options.senderId = req.body.senderId;
        }
        if (req.body.sendCount !== undefined) {
            options.sendCount = req.body.sendCount;
        }
        if (req.body.successCount !== undefined) {
            options.successCount = req.body.successCount;
        }

        req.models.AppSenderHistory.update(options, {
            where: {
                id: req.params.id
            }
        }).then((data) => {
            next();
        });
    };
};

put.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = put;
