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
        'senderId': {
            'reference': 'AppSender',
            'referenceKey': 'id',
            'as': 'Sender',
            'asReverse': 'senderHistories',
            'allowNull': true
        },
        'sendCount': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'successCount': {
            'type': Sequelize.INTEGER,
            'allowNull': true
        },
        'createdAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'updatedAt': {
            'type': Sequelize.BIGINT,
            'allowNull': true
        },
        'deletedAt': {
            'type': Sequelize.DATE,
            'allowNull': true
        }
    },
    'options': {
        'indexes': [{
            name: 'senderId',
            fields: ['senderId']
        }, {
            name: 'sendCount',
            fields: ['sendCount']
        }, {
            name: 'successCount',
            fields: ['successCount']
        }, {
            name: 'deletedAt',
            fields: ['deletedAt']
        }],
        'charset': CONFIG.db.charset,
        'collate': CONFIG.db.collate,
        'timestamps': true,
        'createdAt': false,
        'updatedAt': false,
        'paranoid': true,
        'hooks': {
            'beforeCreate': mixin.options.hooks.microCreatedAt,
            'beforeBulkUpdate': mixin.options.hooks.useIndividualHooks,
            'beforeUpdate': mixin.options.hooks.microUpdatedAt
        },
        'instanceMethods': Sequelize.Utils._.extend(mixin.options.instanceMethods, {}),
        'classMethods': Sequelize.Utils._.extend(mixin.options.classMethods, {
            'createSenderHistory': function(body, callback) {
                let createdData = null;     //res로 반환할 데이터
                sequelize.models.AppSenderHistory.create(body).then((data) => {
                    createdData = data;
                    return true; // true 를 return 하면 isSuccess 로 들어감
                }).catch(errorHandler.catchCallback(callback)).done((isSuccess) => {
                    if (isSuccess) {
                        callback(201, createdData);
                    }
                });
            },
            'findSenderHistories': function (options, callback) {
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

                sequelize.models.AppSenderHistory.findAndCountAll(query).then((data) => {
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
            'deleteSenderHistoryById': function(id, callback) {
                sequelize.models.AppSenderHistory.destroy({
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
