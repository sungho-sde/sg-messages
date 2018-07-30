var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var get = require('./' + resource + '.get.js');
var gets = require('./' + resource + '.gets.js');
var post = require('./' + resource + '.post.js');
var del = require('./' + resource + '.del.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');

const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api;
api = {
    get: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    'id': '데이터를 얻을 리소스의 id'
                },
                param: 'id',
                title: '',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(get.validate());
                apiCreator.add(get.setParam());
                apiCreator.add(get.supplement());
                apiCreator.run();

            }
            else {
                return params;
            }
        };
    },
    gets: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['size','offset'],
                essential: [],
                resettable: [],
                explains: {
                },
                title: '센더 조회',
                state: 'development'
            };
            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(gets.validate());
                apiCreator.add(gets.setParam());
                apiCreator.add(gets.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    },
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: [
                    'sender',
                    'templateId',
                    'receivers'
                ],
                essential: [
                    'templateId',
                    'receivers'
                ],
                resettable: [],
                explains: {
                    'sender': 'sender',
                    'templateId': 'templateId',
                    'receivers': 'receivers (,)로 구분'
                },
                param: '',
                title: '센더 생성',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);

                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(post.validate());
                // apiCreator.add(post.getTemplateBody());
                apiCreator.add(post.setParam());
                apiCreator.add(post.sendMessage());
                // apiCreator.add(post.setSenderHistory());
                apiCreator.add(post.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    },
    delete: function (isOnlyParams) {
        return function (req, res, next) {
            var params = {
                acceptable: [],
                essential: [],
                resettable: [],
                explains: {
                    'id': '데이터 리소스의 id'
                },
                title: '센더 삭제',
                param: 'id',
                state: 'development'
            };

            if (!isOnlyParams) {
                var apiCreator = new HAPICreator(req, res, next);
                apiCreator.add(req.middles.validator(
                    params.acceptable,
                    params.essential,
                    params.resettable
                ));
                apiCreator.add(del.validate());
                apiCreator.add(del.destroy());
                apiCreator.add(del.supplement());
                apiCreator.run();
            }
            else {
                return params;
            }
        };
    }

};

router.get('/' + resource + '/:id' , api.get());
router.get('/' + resource , api.gets());
router.post('/' + resource, api.post());
router.delete('/' + resource + '/:id', api.delete());

module.exports.router = router;
module.exports.api = api;