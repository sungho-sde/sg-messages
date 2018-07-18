var path = require('path');
var fs = require('fs');
var sequelize = require('../../../../core/server/config/sequelize');
var Profile = require('./profile');
var AppMessage = require('./appMessage');

var models = {
    Profile: Profile,
    AppMessage: AppMessage
};

module.exports = models;