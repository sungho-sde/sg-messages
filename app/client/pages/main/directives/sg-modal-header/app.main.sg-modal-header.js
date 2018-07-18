 export default function sgModalHeader (modalHandler, $timeout) {
    "ngInject";
    return {
        restrict: 'C',
        scope: {
            key: '@',
            focusItem: '@'
        },
        link: function (scope, element, attr) {
            $(element[0]).mousedown(function (e) {
                modalHandler.focusModal(scope.key);
            });
        }
    }
}