var path = require('path');
var filePath = path.resolve(__filename, '../').split('/');
var resource = filePath[filePath.length - 1];

var post = require('./' + resource + '.post.js');
var gets = require('./' + resource + '.gets.js');

var express = require('express');
var router = new express.Router();
var HAPICreator = require('sg-api-creator');

const META = require('../../../../../bridge/metadata/index');
const STD = META.std;

var api;
api = {
    post: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ['title', 'body', 'type'],
                essential: [],
                resettable: [],
                explains: {
                    'id': 'Message ID',
                    'title': '타이틀',
                    'body': '바디'
                },
                param: '',
                title: '메세지 만들기',
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
                apiCreator.add(post.setParam());
                // apiCreator.add(post.sendMessage());
                apiCreator.add(post.supplement());
                apiCreator.run();

                delete apiCreator;
            }
            else {
                return params;
            }
        };
    },
    gets: function (isOnlyParams) {
        return function (req, res, next) {

            var params = {
                acceptable: ["size", "offset"],
                essential: [],
                resettable: [],
                explains: {
                    "size": "가져올 데이터 수",
                    "offset": "offset",
                },
                title: '메세지 리스트 조회',
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
    }

};

router.post('/' + resource, api.post());
router.get('/' + resource , api.gets());

module.exports.router = router;
module.exports.api = api;