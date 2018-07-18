var appRootUrl = 'http://localhost:3001';
var appRootPath = require("app-root-path");

module.exports = {
    app: {
        secret: '123',
        maxUploadFileSize: 100 * 1024 * 1024,
        maxUploadFileSizeMBVersion: '10mb',
        port: 3001,
        rootUrl: appRootUrl,
        csFileDir: appRootPath.path + "/cs",
        uploadStore: "local"
    },
    db: {
        mongodb: 'mongodb://localhost/slogup',
        redis: 'redis://localhost:6379/slogup',
        mysql: 'mysql://localhost:3306/core',
        logging: false,
        force: false
    },
    "flag": {
        "isUseHttps": false,
        "isUseRedis": false,
        "isUseCluster": false,
        "isDuplicatedLogin": true,
        "isAutoVerifiedEmail": false,
        "isUseChat": false,
        "isUseBrowserCount": true
    },
    facebook: {
        clientID: '',
        clientSecret: '',
        callbackURL: appRootUrl + '/oauth/facebook/callback'
    },
    twitter: {
        clientID: '',
        clientSecret: '',
        callbackURL: appRootUrl + '/oauth/twitter/callback'
    },
    google: {
        clientID: '',
        clientSecret: '',
        callbackURL: appRootUrl + '/oauth/google/callback'
    },
    aws: {
        "accessKeyId": "",
        "secretAccessKey": "",
        "region": "",
        "bucketName": ""
    },
    sender: {
        infoBankSMS: {
            "senderName": "",
            "serviceId": "",
            "servicePw": "",
            "from": "",
            "mmsSendUrl": "",
            "tokenUrl": "",
            "imageUploadUrl": "",
            "mmsUse": "false"
        },
        apiStoreSMS: {
            senderName: "slogup",
            token: "MjIwOS0xNDIyMzQ2NDIxMzEwLWFjYWVmOTk0LTIzYTEtNGVmMi1hZWY5LTk0MjNhMTJlZjJkMQ==",
            from: "01024069744",
            url: 'http://api.openapi.io/ppurio/2/message/sms/slogup',
            comment: 'default'
        },
        twillio: {
            "accountSID": "",
            "token": "",
            "from": ""
        },
        apn: {
            key: '',
            cert: '',
            gateway: "gateway.sandbox.push.apple.com",
            pass: "",
            port: 2195,
            cacheLength: 20
        },
        gcm: {
            key: '',
            retry: 20
        },
        email: {
            host: '',
            port: 587,
            from: "",
            user: "",
            pass: "",
            name: ""
        }
    }
};