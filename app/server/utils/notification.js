var async = require('async');
var fs = require('fs');
var path = require('path');

module.exports = {
    sendMessage: function (req, phoneNum, message, callback, file) {
        var _this = this;
        var from = null;

        if (req.user.profile.sendPhoneNum) {
            from = req.user.profile.sendPhoneNum;
        }

        if (req.body.sendMethod == req.meta.std.message.sendMethodMms) {
            _this.sendMms(req, from, phoneNum, message, file, callback);
        } else {
            _this.sendSms(req, from, phoneNum, message, callback);
        }
    },
    sendSms: function (req, from, phoneNum, message, callback) {
        if (req.sendNoti.sms) {
            req.sendNoti.sms(from, phoneNum, '', message, function (err, body) {
                if (err) {
                    callback(err.status, req.phoneErrorRefiner(err));
                } else {
                    callback(200, body);
                }
            });
        } else {
            callback(204);
        }
    },
    sendMms: function (req, from, phoneNum, message, file, callback) {
        if (req.sendNoti.mms) {
            var title = '';
            if (req.body.mmsTitle !== undefined) {
                title = req.body.mmsTitle;
            }
            req.sendNoti.mms(from, phoneNum, title, message, file, function (err, body) {
                if (err) {
                    callback(err.status, req.phoneErrorRefiner(err));
                } else {
                    callback(200, body);
                }
            });
        } else {
            callback(204);
        }
    },
    sendAll: function (req, array, file, callback) {
        var EXPORT_HISTORY = req.meta.std.exportHistory;
        var FILE = req.meta.std.file;

        var messageFilePath = EXPORT_HISTORY.rootUrl + '/' + FILE.folderEtc + '/' + FILE.folderMessage + '/' + array[0].messageId + '.csv';
        var _this = this;
        var failArray = [];
        var funcs = [];

        for (var i=0; i<array.length; i++) {
            (function (currentTime) {
                funcs.push(function (subCallback) {
                    _this.sendMessage(req, array[currentTime].phoneNum, array[currentTime].message, function (status, data) {
                        if (status == 200) {
                            if (data) {
                                try {
                                    var message = array[currentTime].csvUserId + ',' + JSON.parse(data).cmid;
                                    fs.appendFile('.' + messageFilePath, message, function (err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                } catch (err) {
                                    // console.log(err);
                                }
                            }
                        } else if (status == 204) {
                            /**
                             * no callback message - no sendNoti (sms or mms)
                             */
                        } else {
                            var errorMessage = "unexpected error";
                            if (data instanceof Object && data.message) {
                                errorMessage = data.message;
                            } else if (data instanceof String) {
                                errorMessage = data;
                            }

                            failArray.push({
                                messageId: array[currentTime].messageId,
                                csvUserId: array[currentTime].csvUserId,
                                errorCode: errorMessage
                            });
                        }
                        subCallback(null, true);
                    }, file);
                });
            })(i);
        }

        async.series(funcs, function (errorCode, results) {
            callback(failArray);
        });
    }
};