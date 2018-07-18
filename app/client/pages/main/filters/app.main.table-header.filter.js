export default function tableHeader () {
    'ngInject';
    return function (fields, options) {
        var itemFields = [];
        if (fields && fields.length) {
            fields.forEach(function (field, index) {
                var itemField = {
                    field: field
                };
                if (options && options[index]) {
                    itemField.option = options[index];
                }
                itemFields.push(itemField);
            });
        }
        return itemFields;
    }
}