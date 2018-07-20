var path = require('path');
var fs = require('fs');
var sequelize = require('../../../../core/server/config/sequelize');
var Profile = require('./profile');
var AppTemplate = require('./app-template');

var models = {
    Profile: Profile,
    AppTemplate: AppTemplate
};

module.exports = models;