export default function NavCtrl ($scope, navigator, sideNavItems, dialogHandler) {
    "ngInject";

    var vm = $scope.vm;

    $scope.goTo = goTo;
    $scope.notService = notService;
    $scope.goToUserMgmt = goToUserMgmt;
    $scope.goToMessageMgmt = goToMessageMgmt;
    $scope.goToSenderMgmt = goToSenderMgmt;


    var defaultSearch = {
        page: 1,
        size: vm.defaultLoadingLength
    };

    function goTo (key) {
        navigator.goTo(key);
    }

    function notService () {
        return dialogHandler.show(false, vm.translate("serviceNotYet"), false, true);
    }

    function goToUserMgmt(){
        navigator.goTo("user-mgmt", defaultSearch);
    }

    function goToMessageMgmt(){
        navigator.goTo("message-mgmt", defaultSearch);
    }

    function goToSenderMgmt(){
        navigator.goTo("sender-mgmt", defaultSearch);
    }
}