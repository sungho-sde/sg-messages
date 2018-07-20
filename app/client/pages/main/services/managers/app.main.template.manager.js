export default function templateManager (Templates, metaManager, dialogHandler, statusHandler) {
    'ngInject';

    this.findAll = findAll;

    function findAll (data, callback) {

        var query = {};
        if (data.offset !== undefined) query.offset = data.offset;
        if (data.size !== undefined) query.size = data.size;

        dialogHandler.validator(query, [
            "size",
            "offset",
        ], null, null, function (data) {
            
            Templates.query(data, function (data) {
                callback(200, data);
            }, function (data) {
                statusHandler.active(data, callback);
            });
        });
    }

}