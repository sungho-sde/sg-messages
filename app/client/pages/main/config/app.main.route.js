routes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default function routes($stateProvider, $urlRouterProvider) {
    "ngInject";
    var templatePath = window.meta.std.templatePath;
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('redirect', {
            url: '/',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/redirect.html'
                }
            }
        }).
        state('user-mgmt', {
        url: '/user',
        views: {
            contents: {
                templateUrl: templatePath + 'main/views/contents/user/user-mgmt.html'
            }
        }
        })
        .state('message-mgmt', {
            url: '/messages?page&size',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/message/message-mgmt.html'
                }
            }
        })
        .state('sender-mgmt', {
            url: '/sender',
            views: {
                contents: {
                    templateUrl: templatePath + 'main/views/contents/sender/sender-mgmt.html'
                }
            }
        });
}