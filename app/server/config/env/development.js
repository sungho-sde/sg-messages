module.exports = {
    app: {
        port: 8080,
        uploadStore: "local"
    },
    db: {
        mysql: 'mysql://root:1234qwer@localhost:3306/message',
        logging: false,
        force: false
    }

};