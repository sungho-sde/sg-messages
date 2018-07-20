var gets = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);


gets.validate = function () {
    return function (req, res, next) {
        if (req.query.offset === undefined) req.query.lastOffset = 0;
        if (req.query.size === undefined) req.query.size = req.meta.std.common.defaultLoadingLength;
        req.check('lastOffset', '400_5').isInt();
        req.check('size', '400_5').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

gets.setParam = function () {
    return function (req, res, next) {

        console.log('\n req.query: ',req.query);
        // req.models.AppMessage.findByTitle(req.query, (status, data) => {
        req.models.AppTemplate.findTemplates(req.query, (status, data) => {
            if (status == 200) {
                req.data = data;
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

gets.supplement = function () {
    return function (req, res, next) {
        return res.hjson(req, next, 200, { data: req.data, count: 0 });
    };
};

module.exports = gets;
