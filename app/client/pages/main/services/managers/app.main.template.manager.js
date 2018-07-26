export default function templateManager (Templates, metaManager, dialogHandler, statusHandler) {
    'ngInject';

    this.findById = findById;
    this.findAll = findAll;
    this.create = create;
    this.update = update;
    this.remove = remove;

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
    function create(data,callback) {
        var body = {};
        if(data.title !== undefined) body.title = data.title;
        if(data.body !== undefined) body.body = data.body;

        dialogHandler.validator(body, [
            'title',
            'body'
        ], null, null, function (data) {
            var templates = new Templates(data);
            templates.$save(data, function (data) {
                callback(201, data);
            }, function (data) {
                statusHandler.active(data, callback);
            });
        });
    }

}