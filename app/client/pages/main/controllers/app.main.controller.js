export default function MainCtrl($rootScope, $scope, $location, $filter, dialogHandler, statusHandler, loadingHandler, modalHandler, metaManager) {

    var vm = $scope.vm = {};
    dialogHandler.init(vm);
    statusHandler.init(vm);
    loadingHandler.init(vm);
    modalHandler.init($scope, preventScrollOn, preventScrollOff);

    vm.modalHandler = modalHandler;
    vm.translate = $filter('translate');
    vm.COMMON = metaManager.std.common;
    vm.defaultLoadingLength = vm.COMMON.defaultLoadingLength;
    vm.defaultLoadingLength = vm.COMMON.defaultLoadingLength;
    vm.minModalHeight = 111;
    vm.bodyStyle = {};

    vm.focusedRows = {};
    vm.currentNav = {};
    vm.isNavOpen = true;
    vm.EVENT = {UPDATE: "UPDATE", REMOVE: "REMOVE"};
    vm.defaultModalSelectOption = {
        maxWidth: "360px",
        width: "calc(100% - 120px)",
        height: 36,
        itemHeight: 30, float: "left",
        totalSelect: true
    };


    vm.currentPage = currentPage;


    function preventScrollOn() {
        vm.bodyStyle['overflow-y'] = 'hidden';
    }

    function preventScrollOff() {
        vm.apply(function () {
            vm.bodyStyle['overflow-y'] = 'auto';
        });
    }


    function currentPage(page) {
        vm.currentNav = {};
        vm.currentNav[page] = true;
    }

    $scope.$on("$locationChangeStart", function (e, next, current) {
        if (modalHandler.isOpenModal()) {
            modalHandler.closeAll();
        }
    });


    vm.apply = function (callback) {
        if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest') {
            callback();
        } else {
            $scope.$apply(function () {
                callback();
            });
        }
    };
}