export default function sgSearchDatePicker ($rootScope, metaManager) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;

    return {
        restrict: 'E',
        scope: {
            sgStartDate: '=',
            sgEndDate: '='
        },
        templateUrl: templatePath + 'main/directives/sg-search-date-picker/app.crm.sg-search-date-picker.html',
        link: function (scope, element, attr) {
            var defaultMinLimit = new Date(0).toDateString();
            var defaultMaxLimit = new Date().toDateString();

            scope.clearDate = clearDate;

            scope.startMinLimit = defaultMinLimit;
            scope.startMaxLimit = defaultMaxLimit;
            scope.endMinLimit = defaultMinLimit;
            scope.endMaxLimit = defaultMaxLimit;

            scope.$watch('sgStartDate', function (newVal, oldVal) {
                if (newVal) {
                    scope.endMinLimit = new Date(newVal).toDateString();
                } else {
                    scope.endMinLimit = defaultMinLimit;
                }
            }, true);

            scope.$watch('sgEndDate', function (newVal, oldVal) {
                if (newVal) {
                    scope.startMaxLimit = new Date(newVal).toDateString();
                } else {
                    scope.startMaxLimit = defaultMaxLimit;
                }
            }, true);

            function clearDate (key) {
                scope[key] = '';
            }
        }
    }
}