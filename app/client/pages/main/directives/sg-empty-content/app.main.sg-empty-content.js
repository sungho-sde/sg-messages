export default function sgEmptyContent (metaManager) {
    'ngInject';

    var templatePath = metaManager.std.templatePath;

    return {
        restrict: 'AE',
        scope: {
            sgIf: '='
        },
        templateUrl: templatePath + 'main/directives/sg-empty-content/app.main.sg-empty-content.html',
        link: function (scope, element, attr) {
        }
    }
}