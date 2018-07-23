var get = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);

get.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();
        req.utils.common.checkError(req, res, next);
    };
};

get.setParam = function () {
    return function (req, res, next) {
        req.models.AppTemplate.findOne({
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

get.supplement = function () {
    return function (req, res, next) {
        res.hjson(req, next, 200, req.data);
    };
};

module.exports = get;
