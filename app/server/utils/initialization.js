var STD = require('../../../bridge/metadata/standards');
var LOCAL = require('../../../bridge/metadata/localization');
var fs = require('fs');
var path = require('path');
var config = require('../../../bridge/config/env');
var sequelize = require('../../../core/server/config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');

module.exports = {
    defaultDomainRenders: [{
        domain: "localhost:" + config.app.port,
        render: "main",
        language: "ko",
        country: "kr"
    }],
    run: function (callback) {
        var _this = this;
        sequelize.transaction(function (t) {
            return _this.initDomainRender(t);
        }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
            if (isSuccess) {
                callback(204);
            }
        });
    },
    initDomainRender: function (t) {
        var _this = this;
        return sequelize.models.DomainRender.count({
            transaction: t
        }).then(function (data) {
            if (data >= _this.defaultDomainRenders.length) {
                return true;
            } else {
                return sequelize.models.DomainRender.bulkCreate(_this.defaultDomainRenders, {
                    transaction: t
                });
            }
        });
    }
};