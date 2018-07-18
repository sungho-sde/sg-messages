export default function sgSideNav(metaManager, navigator, $timeout, $state, queryStringItems, sideNavParentItems) {
    "ngInject";

    var templatePath = metaManager.std.templatePath;
    var defaultQuery = queryStringItems.defaultQueryString;
    var USER = metaManager.std.user;
    var sideNavParent = sideNavParentItems;

    return {
        restrict: 'E',
        scope: {
            sgSideNavItem: '=',
            sgSpecifiedId: '@',
            sgSession : '='
        },
        templateUrl: templatePath + 'main/directives/sg-side-nav/app.crm.sg-side-nav.html',
        link: function (scope, element, attr) {

            (function () {
                $timeout(function () {
                    if($state.current.name.indexOf('workAssignment') != -1){
                        scope.currTab = "engineerWorkManagement";
                        scope.fixedTab = 'engineerWorkManagement';
                        scope.currNav = "workAssignment";
                        return;
                    } else if ($state.current.name == 'workHistory') {
                        scope.currTab = "engineerWorkManagement";
                        scope.fixedTab = 'engineerWorkManagement';
                        scope.currNav = $state.current.name;
                    }

                    if($state.current.name.indexOf('.') != -1) {
                        scope.currTab = $state.current.name.split('.')[0];
                        scope.fixedTab = $state.current.name.split('.')[0];
                        scope.currNav = $state.current.name.split('.')[1];
                    } else {
                        scope.currNav = $state.current.name;
                    }
                },100);
            })();

            scope.$on("$locationChangeSuccess", function () {
                if($state.current.name.indexOf('workAssignment') != -1){
                    scope.currTab = "engineerWorkManagement";
                    scope.fixedTab = 'engineerWorkManagement';
                    scope.currNav = "workAssignment";
                    return;
                } else if ($state.current.name == 'workHistory') {
                    scope.currTab = "engineerWorkManagement";
                    scope.fixedTab = 'engineerWorkManagement';
                    scope.currNav = $state.current.name;
                }
                if($state.current.name.indexOf('.') != -1) {
                    scope.currTab = $state.current.name.split('.')[0];
                    scope.fixedTab = $state.current.name.split('.')[0];
                    scope.currNav = $state.current.name.split('.')[1];
                } else {
                    scope.currNav = $state.current.name;
                }
            });

            scope.currNav = null;
            scope.currTab = null;
            scope.fixedTab = null;
            scope.navSelect = navSelect;
            scope.isLoggedInRole = isLoggedInRole;

            function navSelect(param, e) {
                var naviParams = defaultQuery[param] ? defaultQuery[param] : {};

                navigator.goNavTabs(param, naviParams);
            }

            function tabOpen(param) {
                if(scope.currTab == param){
                    if(sideNavParent[param].indexOf(scope.currNav) != -1){
                        return;
                    }
                    scope.currTab = null;
                    return;
                }
                scope.currTab = param;
            }

            function isLoggedInRole (role) {
                return (scope.sgSession && scope.sgSession.id && scope.sgSession.role >= USER[role]);
            }

            scope.clickTab = function (navItem) {
                if(navItem.hasOwnProperty('child')){
                    tabOpen(navItem.name);
                } else {
                    navSelect(navItem.name);
                }
            }

        }
    }
}