var del = {};
var Logger = require('sg-logger');
var logger = new Logger(__filename);


del.validate = function () {
    return function (req, res, next) {
        req.check('id', '400_12').isInt();

        req.utils.common.checkError(req, res, next);
    };
};

del.destroy = function () {
    return function (req, res, next) {
        req.models.AppTemplate.deleteSenderHistoryById(req.params.id, (status, data) => {
            console.log('delete',req.params);
            if (status == 200) {
                next();
            } else {
                return res.hjson(req, next, status, data);
            }
        });
    };
};

del.supplement = function () {
    return function (req, res, next) {
        return res.hjson(req, next, 204);
    };
};

module.exports = del;
