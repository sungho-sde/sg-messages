export default function modalHandler ($compile, $filter, $timeout) {
    "ngInject";

    var $body = $('body');
    var $overlay = $('<div class="sg-modal-overlay">');
    $overlay.attr("tabindex", "0");

    var PX = 'px';
    var modalBaseClass = "sg-modal-wrap";
    var modalHeaderClass = "sg-modal-header";
    var modalContentClass = "sg-modal-content";
    var includeSourceHead = "'/pages/main/views/";
    var includeSourceTail = ".html'";
    var defaultModalZIndex = 200;
    var currentModalZIndex = 200;

    var controllerScope = null;
    var focusQueue = [];
    var modalQueue = [];
    var modalKeyIndex = {};
    var modalChildKey = {};
    var preventFocusKey = {};

    this.init = init;
    this.setRoot = setRoot;
    this.openModal = openModal;
    this.focusModal = focusModal;
    this.closeAll = closeAll;
    this.closeModal = closeModal;
    this.isOpenModal = isOpenModal;
    this.closeFocusModal = closeFocusModal;

    /**
     * main controller scope 받아온다.
     * @param scope: controller scope
     */
    function init (scope) {
        controllerScope = scope;
    }

    /**
     * 모든 모달창을 close 하고 새로운 모달을 띄운다.
     * @param ownKey: own modal page key value
     * @param key: modal page key value
     * @param viewFolder: modal page path
     */
    function setRoot (ownKey, key, viewFolder) {
        closeAll();
        openModal(ownKey, key, viewFolder);
    }

    /**
     * 모든 모달창을 close 한다.
     */
    function closeAll () {
        for (var i=0; i<modalQueue.length; i++) {
            modalQueue[i].modal.remove();
        }
        $overlay.remove();
        focusQueue = [];
        modalQueue = [];
        modalKeyIndex = {};
        modalChildKey = {};
        preventFocusKey = {};
    }

    /**
     * 기존의 자기 자신 모달창을 닫고 모달창을 새로 띄운다.
     * 처음 띄워진 모달일 경우 overlay 를 띄운다.
     * @param ownKey: own modal page key value
     * @param key: modal page key value
     * @param viewFolder: modal page path
     * @param styleOptions: modal page style options
     * @param options: modal options
     */
    function openModal (ownKey, key, viewFolder, styleOptions, options) {
        closeModal(key);

        if (options && options.preventFocus) {
            preventFocusKey[key] = true;
        }

        if (!modalQueue.length) {
            $body.append($overlay);
            $overlay.focus();
            overlayBindEvent();
        }

        var $newModal = generateModal(key, styleOptions, options);
        $newModal.append(generateModalHeader(key));
        $newModal.append(generateModalContentWrap(key, viewFolder, options));

        if (modalChildKey[ownKey]) {
            modalChildKey[ownKey].push(key);
        } else {
            modalChildKey[ownKey] = [key];
        }

        modalKeyIndex[key] = modalQueue.length;
        modalQueue.push({
            key: key,
            modal: $newModal
        });
        focusQueue.push({
            key: key,
            modal: $newModal
        });

        $overlay.append($compile($newModal)(controllerScope));

        focusModal(key);
    }

    /**
     * overlay에 event를 바인딩한다.
     */
    function overlayBindEvent () {
        $overlay.unbind('keydown');
        $overlay.bind('keydown', function (e) {
            var keyCode = (e.keyCode ? e.keyCode : e.which);
            if (keyCode == 27) {
                closeFocusModal();
            }
        });
    }

    /**
     * focus 배열을 정리하고, 모달창을 focusing 한다.
     * @param key: modal page key value
     */
    function focusModal (key) {
        if (!preventFocusKey[key]) {
            var focusKeyIndex = null;
            for (var i=0; i<focusQueue.length; i++) {
                if (focusQueue[i].key == key) {
                    focusKeyIndex = i;
                    break;
                }
            }
            var focusModal = focusQueue.splice(focusKeyIndex, 1);
            focusQueue.push({
                key: key,
                modal: focusModal[0].modal
            });
            modalQueue[modalKeyIndex[key]].modal.css("z-index", currentModalZIndex);
            currentModalZIndex++;
            if (currentModalZIndex > 400) {
                for (var i=0; i<modalQueue.length; i++) {
                    modalQueue[i].modal.css("z-index", modalQueue[i].modal.css("z-index") - defaultModalZIndex + 1 + modalQueue.length);
                    currentModalZIndex = defaultModalZIndex + modalQueue.length;
                }
            }
        }
    }

    /**
     * 현재 포커싱된 modal을 삭제
     */
    function closeFocusModal () {
        var focusModalKey = focusQueue.splice(focusQueue.length - 1, 1)[0].key;
        closeModal(focusModalKey, true);
    }

    /**
     * 자신을 삭제하고 자식 modal 삭제
     * 띄워져 있는 모달이 없는 경우 overlay 삭제
     * @param key: modal page key value
     * @param already: already splice check
     */
    function closeModal (key, already) {
        delete preventFocusKey[key];
        if (!already) {
            for (var i=0; i<focusQueue.length; i++) {
                if (focusQueue[i].key == key) {
                    focusQueue.splice(i, 1);
                    break;
                }
            }
        }
        var targetIndex = modalKeyIndex[key];
        if (targetIndex !== undefined) {
            modalQueue[targetIndex].modal.remove();
            modalQueue.splice(targetIndex, 1);
            for (var i=targetIndex; i<modalQueue.length; i++) {
                modalKeyIndex[modalQueue[i].key] = i;
            }
            delete modalKeyIndex[key];
        }
        if (!modalQueue.length) {
            $overlay.remove();
        }
        if (modalChildKey[key]) {
            if (modalChildKey[key].length) {
                for (var i=0; i<modalChildKey[key].length; i++) {
                    closeModal(modalChildKey[key].splice(i, 1)[0]);
                    i--;
                }
            } else {
                delete modalChildKey[key];
            }
        }
    }

    /**
     * modal wrap generate
     * @param key: modal page key value
     * @param styleOptions: modal page style options
     * @param options: modal options
     * @returns {jQuery|HTMLElement}: modal header element
     */
    function generateModal (key, styleOptions, options) {
        var resizableOption = {
            containment: 'parent'
        };
        if (options) {
            if (options.maxResizableWidth) resizableOption.maxWidth = options.maxResizableWidth;
            if (options.maxResizableHeight) resizableOption.maxHeight = options.maxResizableHeight;
            if (options.minResizableWidth) resizableOption.minWidth = options.minResizableWidth;
            if (options.minResizableHeight) resizableOption.minHeight = options.minResizableHeight;
        }
        var $newModal = $('<div>').draggable({
            containment: 'parent',
            handle: "." + modalHeaderClass
        }).resizable(resizableOption);
        $newModal.css("position", "absolute");
        $newModal.addClass(modalBaseClass);
        $newModal.attr("data-ng-click", "vm.modalHandler.focusModal('" + key + "')");
        if ((!styleOptions || (!styleOptions.top && !styleOptions.left && !styleOptions.right)) && modalQueue.length) {
            var px = (50 + 100 * modalQueue.length) + PX;
            $newModal.css("top", px);
            $newModal.css("left", px);
        }
        if (styleOptions) {
            if (styleOptions && styleOptions.width) {
                styleOptions.width = generateWidth(styleOptions.width.replace(PX, ''));
            }
            if (styleOptions && styleOptions.height) {
                styleOptions.height = generateHeight(styleOptions.height.replace(PX, ''));
            }
            for (var k in styleOptions) {
                $newModal.css(k, styleOptions[k]);
            }
        }
        if (options) {
            if (options.center) {
                var bodyWidth = $body.width() + parseInt($body.css('padding-left'));
                var bodyHeight = $body.height() + parseInt($body.css('padding-top'));
                var width = 300;
                var height = 300;
                if (styleOptions && styleOptions.width) {
                    width = styleOptions.width.replace(PX, '');
                }
                if (styleOptions && styleOptions.height) {
                    height = styleOptions.height.replace(PX, '');
                }
                var top = 0;
                var left = 0;
                if (bodyWidth - width > 0) {
                    left = (bodyWidth - width) / 2;
                }
                if (bodyHeight - height > 0) {
                    top = (bodyHeight - height) / 2;
                }
                $newModal.css("top", top + PX);
                $newModal.css("left", left + PX);
            }
        }
        return $newModal;
    }

    /**
     * modal header generate
     * @param key: modal page key value
     * @returns {jQuery|HTMLElement}: modal header element
     */
    function generateModalHeader (key) {
        var $newModalHeader = $('<div>');
        $newModalHeader.attr("key", key);
        $newModalHeader.addClass(modalHeaderClass);
        var $newTitle = $('<p>');
        $newTitle.text($filter('translate')(key));
        $newModalHeader.append($newTitle);
        var $newCloseButton = $('<button>');
        $newCloseButton.attr("type", "button");
        $newCloseButton.attr("data-ng-click", "vm.modalHandler.closeModal('" + key + "')");
        var $tag1 = $('<i>');
        var $tag2 = $('<i>');
        $newCloseButton.append($tag1);
        $newCloseButton.append($tag2);
        $newModalHeader.append($newCloseButton);
        return $newModalHeader;
    }

    /**
     * modal content wrap generate
     * @param key: modal page key value
     * @param viewFolder: modal page path
     * @param options: modal options
     * @returns {jQuery|HTMLElement}: modal content wrap element
     */
    function generateModalContentWrap (key, viewFolder, options) {
        var $newModalContentWrap = $('<div>');
        $newModalContentWrap.addClass(modalContentClass);
        $newModalContentWrap.append(generateModalContent(key, viewFolder, options));
        return $newModalContentWrap;
    }

    /**
     * modal content generate
     * @param key: modal page key value
     * @param viewFolder: modal page path
     * @param options: modal options
     * @returns {jQuery|HTMLElement}: modal content element
     */
    function generateModalContent (key, viewFolder, options) {
        var src = includeSourceHead + viewFolder + '/' + key + includeSourceTail;
        var $newModalContent = $('<ng-include>');
        $newModalContent.attr("src", src);
        if (options) {
            if (options.eventKey !== undefined) {
                $newModalContent.attr("event-key", options.eventKey);
            }
            if (options.eventId !== undefined) {
                $newModalContent.attr("event-id", options.eventId);
            }
            if (options.eventIndex !== undefined) {
                $newModalContent.attr("event-index", options.eventIndex);
            }
            if (options.eventData !== undefined) {
                $newModalContent.attr("event-data", options.eventData);
            }
        }
        return $newModalContent;
    }

    /**
     * check modal open
     * @returns {boolean}: is modal open
     */
    function isOpenModal () {
        return (modalQueue.length > 0)
    }

    /**
     * generate modal width size
     * @param width: is current modal width
     */
    function generateWidth (width) {
        var w = window.innerWidth;
        if (w < width) {
            width = w;
        }
        return width + PX;
    }

    /**
     * generate modal height size
     * @param height is current modal height
     */
    function generateHeight (height) {
        var h = window.innerHeight;
        if (h < height) {
            height = h;
        }
        return height + PX;
    }
}