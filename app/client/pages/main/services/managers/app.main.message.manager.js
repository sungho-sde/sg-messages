export default function messageManager (Messages, metaManager, dialogHandler, statusHandler) {
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
            
            Messages.query(data, function (data) {
                callback(200, data);
            }, function (data) {
                statusHandler.active(data, callback);
            });
        });
    }

}