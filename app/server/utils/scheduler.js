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
            this.eventMessage(); // event message 전송
            this.reqEstimationPush(); // 견적요청 push 발송

            this.reqEstimationProcess(); // 24시간 후 견적요청 만료

            this.anotherCallPush(); // 전화연락한 견적이 있는 경우 1시간뒤 기사들에게 푸시

            this.bookAsHistoryBeforeDay(); // A/S 방문예약 하루 전날 발송
            this.expiredAsHistory(); // A/S 문의에 대해 n일 동안 반응하지 않는 경우 발송
            this.uncompletedAsHistory(); // A/S 방문예약 하루 후까지 완료 안한 경우 발송

            // this.bookInstallBeforeDayPush(); // 설치예약 하루 전 푸시
            this.bookInstallTodayPush(); // 설치예약 당일 푸시

            this.installAfterDayMessage(); // 설치 익일 A/S보증서 발급 유도

            this.expirationPremiumInfoMessage(); // 프리미엄 입금 만료 문자 알림

            this.wayBillTracking(); // 운송장번호 조회
            this.expiredVbnkPurchases(); // 가상계좌 만료 상태 변경
            // this.deleteOldPurchases(); // 구매 진행 안 된 오래된 구매내역 삭제

            // this.sendOrder(); // 오더 발송

        } else {

        }
    },
    /**
     * MSA QUEUE 실행
     */
    sendMsaQueue: function () {
        sequelize.models.MsaQueue.executeMsaQueue(requestMinutes, function (status, data) {
            if (status != 204) {
                console.error(status, data);
            }
        });
    },
    /**
     * 오더 발송
     */
    sendOrder: function () {
        console.log("scheduler: send order");
        cron.schedule('0 ' + requestOrderHours + ' * * *', function () {
            (function () {
                sequelize.models.AppOrderQueue.sendOrderQueue(function (status, data) {
                    if (status == 204) {
                        console.log("send order success");
                    } else if (status == 200) {
                        console.log(data);
                    } else if (status == 404) {
                        console.log("send order empty");
                    } else {
                        console.log("send order fail");
                    }
                });
            })();
        });
    },
    /**
     * 운송장번호 조회
     */
    wayBillTracking: function () {
        console.log("scheduler: way bill tracking");
        cron.schedule('0 ' + requestWayBillHours + ' * * *', function () {
            (function () {
                sequelize.models.AppPurchaseItem.wayBillTracking(function (status, data) {
                    if (status == 204) {
                        console.log("way bill tracking success");
                    } else if (status == 200) {
                        console.log(data);
                    } else if (status == 404) {
                        console.log("way bill tracking empty");
                    } else {
                        console.log("way bill tracking fail");
                    }
                });
            })();
        });
    },
    /**
     * 가상계좌 만료 상태 변경
     */
    expiredVbnkPurchases: function () {
        console.log("scheduler: expired vbnk purchases");
        cron.schedule(requestMinutes + ' * * * *', function () {
            (function () {
                sequelize.models.AppPurchase.expiredVbnkPurchases(function (status, data) {
                    if (status == 204) {
                        console.log("expired vbnk purchases success");
                    } else if (status == 200) {
                        console.log(data);
                    } else {
                        console.log("expired vbnk purcahses fail");
                    }
                });
            })();
        });
    },
    /**
     * 결제 진행하지 않은 더미 데이터 삭제
     */
    deleteOldPurchases: function () {
        console.log("scheduler: delete old purchases");
        cron.schedule(requestMinutes + ' * * * *', function () {
            (function () {
                sequelize.models.AppPurchase.deleteOldPurchases(function (status, data) {
                    if (status == 204) {
                        console.log("delete old purchases success");
                    } else if (status == 200) {
                        console.log(data);
                    } else {
                        console.log("delete old purchases fail");
                    }
                });
            })();
        });
    },
    /**
     * Queue에 담긴 event 메세지 전송
     */
    eventMessage: function () {
        console.log("scheduler: event message send");
        cron.schedule(requestMinutes + ' * * * *', function () {
            (function () {
                sequelize.models.AppMessageQueue.sendEventMessage(function (status, data) {
                    if (status == 204) {
                        console.log("send event message success");
                    } else if (status == 200) {
                        console.log(data);
                    } else if (status == 404) {
                        console.log("send event message empty");
                    } else {
                        console.log("send event message fail");
                    }
                });
            })();
        });
    },
    /**
     * 사용자의 견적요청을 기사들에게 알림
     * pushQueue DB 참조하여 push 발송
     */
    reqEstimationPush: function () {
        console.log("scheduler: req-estimation push");
        cron.schedule(requestFiveSeconds + ' * * * * *', function () {
            (function () {
                sequelize.models.AppPushQueue.sendReqEstimationPush(function (status, data) {
                    if (status == 204) {
                        console.log("send req-estimation push success");
                    } else if (status == 200) {
                        console.log(data);
                    } else {
                        console.log("send req-estimation push fail");
                    }
                });
            })();
        });
    },
    /**
     * n(24)시간 지난 후 처리
     * 1. 견적 못 받은 사용자에게 문자 전송
     * 2. 아무도 채택 안한 견적요청 close (모든 견적들도 close)
     * 3. 채택 못 받은 견적 point 돌려주기
     */
    reqEstimationProcess: function () {
        console.log("scheduler: req-estimation n hour process");
        cron.schedule(requestFiveSeconds + ' * * * * *', function () {
            (function () {
                sequelize.models.AppReqEstimation.processNHourReqEstimation(function (status, data) {
                    if (status == 204) {
                        console.log("process n hour req-estimation success");
                    } else if (status == 200) {
                        console.log(data);
                    } else if (status == 404) {
                        console.log("process n hour req-estimation empty");
                    } else {
                        console.log("process n hour req-estimation fail");
                    }
                });
            })();
        });
    },
    /**
     * 사용자가 전화한 지 n(1)시간 지난 후 다른 견적 기사님에게 문자 전송
     * 1. 사용자가 전화한 견적요청이며 전화 시각으로부터 n시간 지난 후 아직 전화를 못 받은 다른 견적 조회
     * 2. 문자 전송 후 문자 전송 플래그 true
     */
    anotherCallPush: function () {
        console.log("scheduler: another estimation call message");
        cron.schedule(requestFiveSeconds + ' * * * * *', function () {
            (function () {
                sequelize.models.AppEstimation.anotherCallPush(function (status, data) {
                    if (status == 204) {
                        console.log("another estimation call success");
                    } else if (status == 200) {
                        console.log(data);
                    } else if (status == 404) {
                        console.log("another estimation call empty");
                    } else {
                        console.log("another estimation call fail");
                    }
                })
            })();
        });
    },
    /**
     * 기사에게
     * A/S 방문 예약 전날 푸시 및 알림톡(문자메세지) 전송
     */
    bookAsHistoryBeforeDay: function () {
        console.log("scheduler: book as-history before day push & message");
        cron.schedule('0 ' + requestSpecialHours + ' * * *', function () {
            (function () {
                sequelize.models.AppAsHistory.bookAsHistoryBeforeDay(function (status, data) {
                    if (status == 204) {
                        console.log("book as-history before day success");
                    } else if (status == 200) {
                        console.log(data);
                    } else if (status == 404) {
                        console.log("book as-history before day empty");
                    } else {
                        console.log("book as-history before day fail");
                    }
                });
            })();
        });
    },
    /**
     * 기사에게
     * A/S 문의 신청이 왔으나 n일 동안 방문예약이나 완료하지 않은 경우 푸시 및 알림톡(문자메세지) 전송
     */
    expiredAsHistory: function () {
        console.log("scheduler: expiration as-history push & message");
        cron.schedule('0 ' + requestSpecialHours + ' * * *', function () {
            (function () {
                sequelize.models.AppAsHistory.expiredAsHistory(function (status, data) {
                    if (status == 204) {
                        console.log("expiration as-history success");
                    } else if (status == 200) {
                        console.log(data);
                    } else if (status == 404) {
                        console.log("expiration as-history empty");
                    } else {
                        console.log("expiration as-history fail");
                    }
                });
            })();
        });
    },
    /**
     * 기사에게
     * A/S 방문예약을 했으나 방문 예약일 다음날까지 완료하지 않은 경우 푸시 및 알림톡(문자메세지) 전송
     */
    uncompletedAsHistory: function () {
        console.log("scheduler: uncompleted as-history push & message");
        cron.schedule('0 ' + requestSpecialHours + ' * * *', function () {
            (function () {
                sequelize.models.AppAsHistory.uncompletedAsHistory(function (status, data) {
                    if (status == 204) {
                        console.log("uncompleted as-history success");
                    } else if (status == 200) {
                        console.log(data);
                    } else if (status == 404) {
                        console.log("uncompleted as-history empty");
                    } else {
                        console.log("uncompleted as-history fail");
                    }
                });
            })();
        });
    },
    /**
     * 설치 예약한 기사님 전날에 푸시 전송
     */
    bookInstallBeforeDayPush: function () {
        console.log("scheduler: book install before day push");
        cron.schedule('0 ' + requestSpecialHours + ' * * *', function () {
            (function () {
                sequelize.models.AppEstimation.bookInstallBeforeDayPush(function (status, data) {
                    if (status == 204) {
                        console.log("book install before day push success");
                    } else if (status == 404) {
                        console.log("book install before day push empty");
                    } else {
                        console.log("book install before day push fail");
                    }
                });
            })();
        });
    },
    /**
     * 설치 예약한 기사님 푸시 전송
     */
    bookInstallTodayPush: function () {
        console.log("scheduler: book install today push");
        cron.schedule(requestMinutes + ' * * * *', function () {
            (function () {
                sequelize.models.AppEstimation.bookInstallTodayPush(function (status, data) {
                    if (status == 204) {
                        console.log("book install today push success");
                    } else if (status == 404) {
                        console.log("book install today push empty");
                    } else {
                        console.log("book install today push fail");
                    }
                });
            })();
        });
    },
    /**
     * 설치요청 익일에 A/S 보증서 발급 유도 문자 전송
     */
    installAfterDayMessage: function () {
        console.log("scheduler: install after day message");
        cron.schedule(requestFiveSeconds + ' * 12,13,14,15 * * *', function () {
            (function () {
                sequelize.models.AppReqEstimation.installAfterDayMessage(function (status, data) {
                    if (status == 204) {
                        console.log("install after day message success");
                    } else if (status == 404) {
                        console.log("install after day message empty");
                    } else {
                        console.log("install after day message fail");
                    }
                });
            })();
        });
    },
    /**
     * 만료 시각까지 결제하지 않은 프리미엄 정보 만료 및 문자 전송
     */
    expirationPremiumInfoMessage: function () {
        console.log("scheduler: expiration premium info message");
        cron.schedule(requestMinutes + ' * * * *', function () {
            (function () {
                sequelize.models.AppPremiumInfo.expirationPremiumInfo(function (status, data) {
                    if (status == 204) {
                        console.log("expiration premium info success");
                    } else if (status == 404) {
                        console.log("expiration premium info empty");
                    } else if (status == 200) {
                        console.log(data);
                    } else {
                        console.log("expiration premium info fail");
                    }
                });
            })();
        });
    },
    /**
     * 만료 시각까지 결제하지 않
     */
    expirationPremiumInfoBeforeDayMessage: function () {
        console.log("scheduler: expiration premium info before one day message");
        cron.schedule('0 ' + requestSpecialHours + ' * * *', function () {
            (function () {

            })();
        });
    },
    /**
     * 가상번호 발급
     */
    autoSetVirtualNum: function () {
        console.log("scheduler: auto set virtual num");
        sequelize.models.AppVirtualNumber.autoSet(function (status, data) {
            if (status == 204) {
                console.log("success");
            } else {
                console.log("fail");
            }
        });
    },
    /**
     * 현재 맵핑되어 있는 가상번호 재 맵핑
     */
    remapVirtualNum: function (userId) {
        console.log("scheduler: remap virtual num");
        sequelize.models.AppVirtualNumber.remapVirtualNum(function (status, data) {
            if (status == 204) {
                console.log("success")
            } else {
                console.log("fail");
            }
        }, userId);
    },
    /**
     * sgsg purchase calculation 동기화
     * @param createdAt - 해당 시각 이후부터 적용
     * @param purchaseId - 해당 purchase ID만 적용
     */
    syncPurchaseCalculation: function (createdAt, purchaseId) {
        console.log("scheduler: sgsg purchase calculation sync");
        sequelize.models.AppPurchase.syncPurchaseCalculation(function (status, data) {
            if (status == 204) {
                console.log("success");
            } else {
                console.log("fail");
            }
        }, createdAt, purchaseId);
    },
    /**
     * 프리미엄 가격 변경
     */
    setPremiumPrice: function () {
        console.log("scheduler: set premium price");
        sequelize.models.AppPremiumPrice.setPremiumPrice(function (status, data) {
            if (status == 204) {
                console.log("success");
            } else {
                console.log("fail");
            }
        });
    }
};