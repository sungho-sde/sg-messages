var path = require('path');
var routeHelper = require('sg-route-helper');
var express = require('express');

var META = require('../../bridge/metadata');

module.exports = function (app) {

    function sampleRenderer() {
        return function (req, res, next) {

            if (req.url === '/oauth/facebook' || req.url.indexOf('/api') != -1) {
                return next();
            }

            req.preparedParam.params.oauth = {};

            if (META.std.flag.isMoreSocialInfo == true) {
                req.preparedParam.params.oauth.facebook = req.flash('facebook')[0];
                req.preparedParam.params.oauth.twitter = req.flash('twitter')[0];
                req.preparedParam.params.oauth.google = req.flash('google')[0];
            }

            req.models.DomainRender.findRender(req.get('host'), function (status, data) {
                if (status == 200) {

                    if (req.isOldBrowser) {
                        res.render('old-browser');
                    } else {
                        var fileName = path.basename(__filename).split('.')[0];
                        if (data == fileName) {
                            res.render('main-' + process.env.NODE_ENV, req.preparedParam);
                        } else {
                            req.renderPage = data;
                            next();
                        }
                    }

                } else {
                    notFoundRenderer(req, res, next);
                }
            });

        };
    }

    function notFoundRenderer(req, res, next) {
        res.render('not-found', req.preparedParam);
    }

    app.get('/',
        routeHelper.prepareParam("main"),
        sampleRenderer()
    );

    app.get('/*',
        routeHelper.prepareParam("main"),
        sampleRenderer()
    );
};