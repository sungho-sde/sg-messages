var STD = require('../../../bridge/metadata/standards');
var cron = require('node-cron');
var sequelize = require('../../../core/server/config/sequelize');
var errorHandler = require('sg-sequelize-error-handler');

var requestMinutes = [];
for (var i=0; i<60; i++) {
    requestMinutes.push(i);
}
requestMinutes = requestMinutes.join(',');

var requestSeconds = requestMinutes;

var requestHours = [];
for (var i=0; i<24; i++) {
    requestHours.push(i);
}
requestHours = requestHours.join(',');

var requestFiveSeconds = [];
for (var i=0; i<12; i++) {
    requestFiveSeconds.push(i * 5);
}

requestFiveSeconds = requestFiveSeconds.join(',');

var requestSpecialHours = [9, 10, 11, 12];
requestSpecialHours = requestSpecialHours.join(',');

var requestWayBillHours = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
requestWayBillHours = requestWayBillHours.join(',');

var requestOrderHours = [10, 12, 14, 18];
requestOrderHours = requestOrderHours.join(',');

var requestTenMinutes = [];
for (var i=0; i<6; i++) {
    requestTenMinutes.push(i * 10);
}
requestTenMinutes = requestTenMinutes.join(',');

module.exports = {
    run: function () {
        if (process.env.CRON_ENV == 'cron') {
            this.messageFromSenderQue();
        } else {
            // this.messageFromTemplate();
        }
    },
    /**
     * 메세지 큐 확인후 전송
     */
    messageFromSenderQue: function () {
        console.log("scheduler: expiration premium info message");
        // cron.schedule('0,30 ' + requestMinutes + ' * * * *', function () {
        cron.schedule(requestFiveSeconds + ' * * * * *', function () {
            (function () {
                sequelize.models.AppSender.sendQueue((status)=>{
                    if (status == 204) {
                        console.log("send message success");
                    } else if (status == 200) {
                        console.log(data);
                    } else {
                        console.log("send message fail");
                    }
                })
            })();
        });
    }
};