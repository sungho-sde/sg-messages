module.exports = {
    app: {
        port: 80,
        uploadStore: "localBucket"
        // httpsPort: 443,
        // keyFile: "key.pem",
        // crtFile: "cert.pem"
    },
    db: {
        mysql: 'mysql://slogup:123123@localhost:3306/slogup',
        logging: false,
        force: false
    }
};