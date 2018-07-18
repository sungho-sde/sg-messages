export default function sgFileOver () {
    "ngInject";

    return {
        'restrict': 'AE',
        'link': function (scope, element, attr) {
            element.on('dragleave', function () {
                $(this).removeClass('sg-file-over');
            });
        }
    }
}