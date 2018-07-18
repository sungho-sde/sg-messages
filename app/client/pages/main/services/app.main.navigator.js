export default function navigator ($state, $filter, metaManager) {
    "ngInject";

    var defaultLoadingLength = metaManager.std.common.defaultLoadingLength;

    var params = {
        page: 1,
        size: defaultLoadingLength
    };

    this.setParams = setParams;

    // this.goToMessages = goToMessages;
    this.goTo = goTo;
    this.goNavTabs = goNavTabs;
    this.goToMessageMgmt = goToMessageMgmt;
    this.goToUserMgmt = goToUserMgmt;
    this.goToSenderMgmt = goToSenderMgmt;

    function setParams (key, value) {
        params[key] = value;
    }

    function goTo (name, param, reload, callback) {
        if (!param) {
            param = params;
        }
        $state.go(name, param, {
            reload: reload
        }).then(function () {
            if (callback) {
                callback();
            }
        });
    }

    function goToUserMgmt(){
        goTo("user-mgmt");
    }

    function goToMessageMgmt(){
        goTo("message-mgmt");
    }

    function goToSenderMgmt(){
        goTo("sender-mgmt");
    }
    // function goToMessages (param, reload) {
    //     var body = angular.merge(params, param);
    //     goTo('messages', param, reload);
    // }

    /**
     * 네비탭선택이동을 하나로통일
     * @param where -> route내의 이름이다 위으 "index"와 같이
     * @param param -> 디폴트파람이 들어가나 파라미터를 전달받은경우 덮어쓴다.
     */
    function goNavTabs(where, param, reload) {
        if (!param) {
            param = {};
        }

        var body = angular.merge(params, param);
        goTo(where, body, reload);
    }
}