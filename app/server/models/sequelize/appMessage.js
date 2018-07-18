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
            'allowNull': true,
            'defaultValue': 'default title'
        },
        'body': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'code': {
            'type': Sequelize.STRING(coreUtils.initialization.getDBStringLength()),
            'allowNull': true
        },
        'date': {
            'type': Sequelize.DATEONLY(),
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