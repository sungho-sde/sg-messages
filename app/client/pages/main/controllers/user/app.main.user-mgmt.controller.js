export default function UserMgmtCtrl($scope, $rootScope, $stateParams, $filter, navigator,templateManager, modalHandler, dialogHandler) {
    "ngInject";

    var vm = $scope.vm;

    $scope.findUsers = findUsers;
    $scope.goToMessage = goToMessage;
    $scope.openUserCreateModal = openUserCreateModal;
    $scope.openUserUploadModal = openUserUploadModal;


    var fields = ['이름', '나이', '성별', '시도', '시군구', '전화번호'];
    $scope.itemFields = $filter('tableHeader')(fields);

    $scope.users = {};

    init();

    $scope.form = {
        size: 12,
        page:1
    };

    function init(){
        $scope.users= {
            count: 0,
            rows: []
        };
        findUsers();
    }

    function findUsers(){
        var query = {};
        var number = $stateParams.page;
        if ($stateParams.size) query.size = $stateParams.size;
        if (number) query.offset = (number - 1) * query.size;



        templateManager.findAll(query, function(status, data){
            if(status == 200){
                $scope.users = data.data;

            }
            else{
                dialogHandler.alertError(status, data);
            }
        });
    }


    function goToMessage(page, reload){
        var params = {};
        if (page) {
            params.page = page;
        } else if ($scope.form.page) {
            params.page = $scope.form.page;
        }

        navigator.goTo("messagesMgmt", params, reload);
    }

    function openUserCreateModal(){
        modalHandler.openModal("user-create", "user-create-modal", "contents/user", {
            width: "500px",
            height: "500px"
        }, {
            center: true,
            eventKey: "user-create",
            eventId: 0,
            eventIndex: 1,
            minResizableWidth: 400,
            minResizableHeight: 400
        });
    }

    function openUserUploadModal(){
        modalHandler.openModal("user-upload", "user-upload-modal", "contents/user", {
            width: "500px",
            height: "500px"
        }, {
            center: true,
            eventKey: "user-create",
            eventId: 0,
            eventIndex: 1,
            minResizableWidth: 400,
            minResizableHeight: 400
        });
    }

    // function openMessageDialog(){
    //     console.log("openMessageDialog");
    //     dialogHandler.show('',"show dialog",'',true);
    //     console.log("open MessageModal");
    //     modalHandler.openModal("message", "created-message", "contents/message", {
    //         width: "250px",
    //         height: "270px"
    //     }, {
    //         center: true,
    //         eventKey: "message",
    //         eventId: 0,
    //         eventIndex: 1,
    //         minResizableWidth: 200,
    //         minResizableHeight: 200
    //     });
    // }


    $rootScope.$on('app.user-create-modal-close', function(event, args){
        console.log(args)
    })


}