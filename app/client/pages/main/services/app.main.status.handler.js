export default function statusHandler (navigator, dialogHandler) {
    "ngInject";
    var vm = null;

    this.init = init;
    this.active = active;

    function init (scopeVm) {
        vm = scopeVm;
    }

    function active (data, callback) {
        if (data.status == 401) {
            navigator.goToLogin();
            vm.session = null;
        } else if (data.status == 403) {
            navigator.goToAuthorized();
            vm.session = null;
        }
        callback(data.status, data.data);
    }
}