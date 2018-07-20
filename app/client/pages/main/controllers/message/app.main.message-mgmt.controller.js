export default function MessagesMgmtCtrl($scope, $rootScope, $stateParams, $filter, navigator, templateManager, modalHandler, dialogHandler) {
    "ngInject";

    var vm = $scope.vm;

    $scope.findMessages = findMessages;
    $scope.openMessageCreateModal = openMessageCreateModal;
    $scope.goToMessageMgmt = goToMessageMgmt;
    // $scope.openMessageDialog = openMessageDialog;

    var fields = ['코드', '제목', '내용', '최근발송일', '생성일', '타입'];
    $scope.itemFields = $filter('tableHeader')(fields);

    $scope.messages = {};
    $scope.form = $stateParams;
    init();
    console.log("\n itemFields: ",$scope.itemFields);
    console.log("\n items:", $scope.item, $scope.itemFields.field );
    console.log('\n stateParams1 : ',$stateParams);

    function init(){
        $scope.messages= {
            count: 0,
            rows: []
        };
        findMessages();
    }

    function findMessages(){

        var query = {};
        var number = $stateParams.page;
        if ($stateParams.size) {
            query.size = $stateParams.size;
        }
        if (number) {
            query.offset = (number - 1) * query.size;
        }


        templateManager.findAll(query, function(status, data){
            if(status == 200){
                $scope.messages = data.data;
                console.log($scope.form);
            }
            else{
                dialogHandler.alertError(status, data);
            }
        });
    }


    function goToMessageMgmt(page, reload){
        var params = {};

        if (page) {
            params.page = page;
        } else if ($scope.form.page) {
            params.page = $scope.form.page;
        }
        if ($scope.form.size) params.size = $scope.form.size;
        navigator.goTo("message-mgmt", params, reload);
    }

    function openMessageCreateModal(){
        modalHandler.openModal("message-create", "message-create-modal", "contents/message", {
            width: "500px",
            height: "500px"
        }, {
            center: true,
            eventId: 0,
            eventIndex: 1,
            eventKey: "message",
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
    

    $rootScope.$on('app.create-message-modal-close', function(event, args){
        console.log(args)
    })

}
