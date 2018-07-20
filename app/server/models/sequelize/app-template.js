/**
 * Message model module.
 * @module core/server/models/sequelize/profile
 */

/**
 * 응답콜백
 * @callback responseCallback
 * @param {number} status - 상태코드
 * @param {Object} data - 성공일 경우 반환된 데이터
 */

var Sequelize = require('sequelize');
var sequelize = require('../../../../core/server/config/sequelize');

var mixin = require('../../../../core/server/models/sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var coreUtils = require("../../../../core/server/utils");
var CONFIG = require('../../../../bridge/config/env');

module.exports = {
    'fields': {
        // 'authorId': {
        //     'reference': 'User',
        //     'referenceKey': 'id',
        //     'as': 'author',
        //     'asReverse': 'releases',
        //     'allowNull': true
        // },
        'title': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': false,
            'defaultValue': 'default title'
        },
        'body': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
    },
    'options': {
        'charset': CONFIG.db.charset,
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'createMessage': function(body, callback) {
                let createdData = null;     //res로 반환할 데이터
                sequelize.models.AppTemplate.create(body).then((data) => {
                    createdData = data;
                    return true; // true 를 return 하면 isSuccess 로 들어감
                }).catch(errorHandler.catchCallback(callback)).done((isSuccess) => {
                    if (isSuccess) {
                        callback(201, createdData);
                    }
                });
            },
            'findTemplates': function (options, callback) {
                var loadedData = null;
                var where = {};
                var query = {
                    order: [['createdAt', STD.common.DESC]],
                    where: where,
                    limit: parseInt(options.size)
                };

                if (options.offset !== undefined) {
                    query.offset = parseInt(options.offset);
                }

                if (options.authorId !== undefined) {
                    where.authorId = options.authorId;
                }

                sequelize.models.AppTemplate.findAndCountAll(query).then((data) => {
                    if (data) {
                        loadedData = data;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: '404_0003'
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done((isSuccess) => {
                    if (isSuccess) {
                        callback(200, loadedData);
                    }
                });
            },
            'deleteTemplateById': function(id, callback) {
                sequelize.models.AppTemplate.destroy({
                    where: {
                        id: id
                    }
                }).catch(errorHandler.catchCallback(callback)).done((isSuccess) => {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            }
        })
    }
};

