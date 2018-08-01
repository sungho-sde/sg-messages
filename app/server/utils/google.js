var STD = require('../../../bridge/metadata/standards');
var CONFIG = require('../../../bridge/config/env');
var GoogleUrl = require( 'google-url' );

module.exports = {
    shorten: function (url, callback) {
        var googleUrl = new GoogleUrl({
            key: CONFIG.googleApi.shorten.key
        });

        googleUrl.shorten(url, function (err, shortUrl) {
            if (err) {
                callback(400);
            } else {
                shortUrl = shortUrl.replace("http://", "");
                shortUrl = shortUrl.replace("https://", "");
                callback(200, shortUrl);
            }
        });
    }
};