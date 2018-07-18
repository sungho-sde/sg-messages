export default function UserUploadModalCtrl ($scope, $rootScope, $element, $filter, modalHandler, dialogHandler, messageManager) {
    'ngInject';

    var vm = $scope.vm;
    var $parent = $element.parent();
    var eventKey = $parent.attr("event-key");
    var eventId = $parent.attr("event-id");
    var eventIndex = $parent.attr("event-index");

    $scope.close = close;
    $scope.createMessage = createMessage;

    $scope.item = null;
    $scope.ready = false;
    $scope.edit = {};
    $scope.form = {};
    $scope.isOpen = false;


    function close () {
        modalHandler.closeModal("message-create");

        $rootScope.$broadcast('app.create-message-modal-close', {
            message: "message-create modal"
        });
    }



    function createMessage(){
        //console.log("createMessage");
        if($scope.form) dialogHandler.show('',"문자 생성 ",'',true);


        // var body = $scope.form;
        // messageManager.create(from, function(status, data){
        //     if(status == 201){
        //         modalHandler.show("성공;");
        //         close();
        //     }
        //     else{
        //
        //     }
        // })
    }
}