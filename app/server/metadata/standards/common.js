var standards = {
    "cdn": {
        "rootUrl": ""
    },
    "flag": {
        "isMoreSocialInfo": false, // 소셜가입할때 추가정보가 필요할경우.\
        "isResponsive": false
    },
    "common": {
        "minSearchLength": 1,
        "maxSearchLength": 100,
        "minLength": 1,
        "maxLength": 190,
        "maxSecretLength": 12,
        "infinite": 10000
    }
};

if (!this.window && module && module.exports) {
    module.exports = standards;
} else {
    if (!window.meta) window.meta = {};
    window.meta.std = standards;
}