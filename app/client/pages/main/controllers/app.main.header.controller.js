export default function HeaderCtrl ($scope) {
    "ngInject";

    var vm = $scope.vm;

    $scope.toggle = toggle;

    function toggle () {
        vm.isNavOpen = !vm.isNavOpen;
    }
}