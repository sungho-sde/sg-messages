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
        'type': {
            'type': Sequelize.CHAR(3),
            'allowNull': true
        }
    },
    'options': {
        'charset': CONFIG.db.charset,
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'createMessage': function(body, callback) {
                let createdData = null;     //res로 반환할 데이터
                sequelize.models.AppMessage.create(body).then((data) => {
                    createdData = data;
                    return true; // true 를 return 하면 isSuccess 로 들어감
                }).catch(errorHandler.catchCallback(callback)).done((isSuccess) => {
                    if (isSuccess) {
                        callback(201, createdData);
                    }
                });
            },
            'deleteMessage': function() {

            },
            'findMessages': function (options, callback) {
                var count = 0;
                var loadedData = null;
                var where = {};
                var countWhere = {};
                var query = {
                    order: [['createdAt', STD.common.ASC]],
                    where: where,
                    limit: parseInt(options.size)
                };

                if (options.offset !== undefined) {
                    query.offset = parseInt(options.offset);
                }

                if (options.authorId !== undefined) {
                    where.authorId = options.authorId;
                    countWhere.authorId = options.authorId;
                }

                if (options.startDate !== undefined || options.endDate !== undefined) {
                    where.createdAt = {
                        $and: []
                    };
                    countWhere.createdAt = {
                        $and: []
                    };
                }

                if (options.startDate !== undefined) {
                    where.createdAt.$and.push({
                        $gt: options.startDate
                    });
                    countWhere.createdAt.$and.push({
                        $gt: options.startDate
                    });
                }

                if (options.endDate !== undefined) {
                    where.createdAt.$and.push({
                        $lt: options.endDate
                    });
                    countWhere.createdAt.$and.push({
                        $lt: options.endDate
                    });
                }
                console.log('\noptions : ',options);
                console.log('\nquery: ',query);
                sequelize.models.AppMessage.count({
                    where: countWhere
                }).then(function (data) {
                    if (data) {
                        count = data;
                        return sequelize.models.AppMessage.findAll(query);
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: '404_0003'
                        });
                    }
                }).then(function (data) {
                    if (data && data.length) {
                        loadedData = data;
                        return true;
                    } else {
                        throw new errorHandler.CustomSequelizeError(404, {
                            code: '404_0003'
                        });
                    }
                }).catch(errorHandler.catchCallback(callback)).done(function (isSuccess) {
                    if (isSuccess) {
                        console.log('(appMessages/findMessages : pass \n\n)');
                        callback(200, {
                            count: count,
                            rows: loadedData
                        });
                    }
                });
            },
            'findByTitle': function (query, callback) {
                let loadedData = null;
                sequelize.models.AppMessage.findAll({ where: query }).then(data => {
                    loadedData = data;
                    return true;
                }).catch(errorHandler.catchCallback(callback)).done((isSuccess) => {
                    if (isSuccess) {
                        callback(200,loadedData);
                    }
                });
            }
        })
    }
};