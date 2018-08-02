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

var getDBStringLength = coreUtils.initialization.getDBStringLength;

module.exports = {
    'fields': {
        'senderId': {
            'reference': 'AppSender',
            'referenceKey': 'id',
            'as': 'sender',
            'asReverse': 'receivers',
            'allowNull': true
        },
        'receiver': {
            'type': Sequelize.STRING(getDBStringLength()),
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
            name: 'senderId',
            fields: ['senderId']
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
        'classMethods': Sequelize.Utils._.extend({ }, mixin.options.classMethods)
    }
};

