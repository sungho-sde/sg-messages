var express = require('express');
var utils = require('../utils/index');
var UAParser = require('ua-parser-js');
var middleWare = require('../middles');

module.exports = function (app) {
    app.use(middleWare.connect());

    app.use(function (req, res, next) {
        req.appUtils = require('../utils');
        next();
    });

    app.use(function (req, res, next) {
        var parser = new UAParser();
        var ua = req.headers['user-agent'];
        var result = parser.setUA(ua).getResult();

        if (typeof ua == 'string') {
            var isMobile = {
                Android: function () {
                    return ua.match(/Android/i);
                },
                BlackBerry: function () {
                    return ua.match(/BlackBerry/i);
                },
                iOS: function () {
                    return ua.match(/iPhone|iPad|iPod/i);
                },
                Opera: function () {
                    return ua.match(/Opera Mini/i);
                },
                Windows: function () {
                    return ua.match(/IEMobile/i) || ua.match(/WPDesktop/i);
                },
                any: function () {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                }
            };

            req.isMobile = isMobile.any();

            if (result.browser.name = 'IE' && parseInt(result.browser.major) < 10) {
                req.isOldBrowser = true;
            }
        }

        next();
    });

};