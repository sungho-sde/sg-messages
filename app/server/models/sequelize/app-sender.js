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
var async = require('async');
var OBJECTIFY = require('../../../../core/server/utils/objectify');

var NOTIFICATION_UTIL = require('../../utils/notification');

var mixin = require('../../../../core/server/models/sequelize/mixin');
var errorHandler = require('sg-sequelize-error-handler');

var STD = require('../../../../bridge/metadata/standards');
var coreUtils = require("../../../../core/server/utils");
var CONFIG = require('../../../../bridge/config/env');
var sendNoti = require('sg-sender').getSender(CONFIG.sender);

var getDBStringLength = coreUtils.initialization.getDBStringLength;

var isSending = false;

module.exports = {

    'fields': {
        // 'authorId': {
        //     'reference': 'User',
        //     'referenceKey': 'id',
        //     'as': 'author',
        //     'asReverse': 'releases',
        //     'allowNull': true
        // },
        'sender': {
            'type': Sequelize.STRING(getDBStringLength()),
            'allowNull': false
        },
        'templateId': {
            'reference': 'AppTemplate',
            'referenceKey': 'id',
            'as': 'template',
            'asReverse': 'senders',
            'allowNull': false
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
            name: 'sender',
            fields: ['sender']
        }, {
            name: 'templateId',
            fields: ['templateId']
        }, {
            name: 'createdAt',
            fields: ['createdAt']
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
        'classMethods': Sequelize.Utils._.extend({
            'getIncludeSender': function () {
                return [
                    {
                    model: sequelize.models.AppReceiver,
                    as: 'receivers'
                },
                {
                    model: sequelize.models.AppTemplate,
                    as: 'template'
                }
                ]
            }
            ,
            'createSender': function(body, callback) {
                let createdData = null;     //res로 반환할 데이터
                sequelize.models.AppSender.create(body).then((data) => {
                    createdData = data;
                    return true; // true 를 return 하면 isSuccess 로 들어감
                }).catch(errorHandler.catchCallback(callback)).done((isSuccess) => {
                    if (isSuccess) {
                        callback(201, createdData);
                    }
                });
            },
            'findSenders': function (options, callback) {
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

                sequelize.models.AppSender.findAndCountAll(query).then((data) => {
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
            'deleteSenderById': function(id, callback) {
                sequelize.models.AppSender.destroy({
                    where: {
                        id: id
                    }
                }).catch(errorHandler.catchCallback(callback)).done((isSuccess) => {
                    if (isSuccess) {
                        callback(204);
                    }
                });
            },
            'sendQueue': function (callback) {
                if (isSending) {
                    return callback(200, "another message is sending");
                } else {
                    isSending = true;
                }

                var funcs = [];
                var msgData = null;
                var senderId = null;
                var sendCount = null;
                var successCount = 0;

                funcs.push(function (subCallback){
                    findUncompletedSender(subCallback);
                });
                funcs.push(function (subCallback){
                    sendMessage(subCallback);
                });
                funcs.push(function (subCallback){
                    updateSenderDeletedAt(subCallback);
                });
                funcs.push(function (subCallback){
                    addSenderHistory(subCallback);
                });

                funcs.push();

                async.series(funcs, function (error, results) {
                    isSending = false;
                    if (error) {
                        callback(error.status, error.data);
                    } else {
                        callback(204);
                    }

                });


                function findUncompletedSender(subCallback){
                    var query = 'SELECT sender.id, template.body, template.url';
                    query += ' FROM AppSenders As sender';
                    query += ' LEFT JOIN AppSenderHistories As senderHistory';
                    query += ' ON sender.id = senderHistory.senderId';

                    // query += ' LEFT JOIN AppReceivers As receiver';
                    // query += ' ON sender.id = receiver.senderId';

                    query += ' LEFT JOIN AppTemplates As template';
                    query += ' ON sender.templateId = template.id';

                    query += ' WHERE sender.deletedAt IS NULL';
                    query += ' AND senderHistory.id IS NULL';

                    query += ' ORDER BY sender.id ASC LIMIT 1';
                    sequelize.query(query, {
                        type: Sequelize.QueryTypes.SELECT
                    }).then(data=>{
                        msgData = data.pop();
                        senderId = msgData.id
                        console.log('Sender data :',msgData);
                        return true;
                    }).catch(errorHandler.catchCallback(function (status, data) {
                        console.log(status, data);
                        subCallback({
                            status: status,
                            data: data
                        }, false);
                    })).done(function (isSuccess) {
                        if (isSuccess) {
                            subCallback(null, true);
                        } else {
                            subCallback({
                                status: 404,
                                data: {}
                            }, false);
                        }
                    });
                }

                function sendMessage(subCallback){
                    var query = 'SELECT receivers.receiver FROM AppReceivers As receivers';
                    query += ' INNER JOIN AppSenders As senders';
                    query += ' ON receivers.senderId = senders.id';
                    query += ' WHERE senders.id = ' + senderId;
                    sequelize.query(query, {
                        type: Sequelize.QueryTypes.SELECT
                    }).then(data=>{
                        sendCount = data.length;

                        data.forEach((receiver)=>{
                            receiver.receiver = coreUtils.notification.massNotification.parse.message(receiver.receiver);
                            console.log('receiver : ', receiver.receiver);
                            if (receiver.receiver != STD.notification.wrongPhoneNum) {
                                NOTIFICATION_UTIL.sms.sendShortUrl(receiver.receiver,msgData.url,msgData.body,()=>{
                                })
                                (function(){successCount++;})()
                            }
                        })
                        return true;
                    }).catch(errorHandler.catchCallback(function (status, data) {
                        console.log(status, data);
                        subCallback({
                            status: status,
                            data: data
                        }, false);
                    })).done(function (isSuccess) {
                        if (isSuccess) {
                            subCallback(null, true);
                        } else {
                            subCallback({
                                status: 404,
                                data: {}
                            }, false);
                        }
                    });
                }

                function updateSenderDeletedAt(subCallback){
                    var query = 'UPDATE AppSenders As sender';
                    query += ' SET sender.deletedAt = NOW()';
                    query += ' WHERE sender.id = ' + senderId;
                    sequelize.query(query, {
                        type: Sequelize.QueryTypes.UPDATE
                    }).then(()=>{
                        return true;
                    }).catch(errorHandler.catchCallback(function (status, data) {
                        console.log(status, data);
                        subCallback({
                            status: status,
                            data: data
                        }, false);
                    })).done(function (isSuccess) {
                        if (isSuccess) {
                            subCallback(null, true);
                        } else {
                            subCallback({
                                status: 404,
                                data: {}
                            }, false);
                        }
                    });
                }

                function addSenderHistory(subCallback){
                    sequelize.models.AppSenderHistory.create({
                            'senderId': senderId,
                            'sendCount': sendCount,
                            'successCount': successCount
                        }
                    ).then(() => {
                        console.log('addSenderHistory (senderId,sendCount,successCount): ', senderId, sendCount, successCount);
                        return true;
                    }).catch(errorHandler.catchCallback(function (status, data) {
                        console.log(status, data);
                        subCallback({
                            status: status,
                            data: data
                        }, false);
                    })).done(function (isSuccess) {
                        if (isSuccess) {
                            subCallback(null, true);
                        } else {
                            subCallback({
                                status: 404,
                                data: {}
                            }, false);
                        }
                    });

                }

            }
        }, mixin.options.classMethods)
    }
};

