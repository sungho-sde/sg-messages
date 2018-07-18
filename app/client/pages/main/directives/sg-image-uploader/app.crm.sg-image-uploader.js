export default function sgImageUploader ($filter, $rootScope, metaManager, FileUploader, dialogHandler, imageModalManager, modalHandler) {
    "ngInject";

    var templatePath = metaManager.std.templatePath;

    return {
        restrict: 'E',
        scope: {
            sgId: '@',
            sgUploadFlag: '=',
            sgUploadFunc: '=',
            sgModel: '=',
            sgChangeOrder: '=',
            sgDeleteItem: '=',
            sgModalKey: '@'
        },
        templateUrl: templatePath + 'main/directives/sg-image-uploader/app.crm.sg-image-uploader.html',
        link: function (scope, element, attr) {
            var OVER_SIZE_MARGIN = 100;
            var imageExp = new RegExp('image', 'i');
            var translate = $filter('translate');
            var imageUrl = $filter('imageUrl');
            var isUploading = false;
            var uploadedArray = [];

            scope.detailImage = detailImage;
            scope.deleteImage = deleteImage;
            scope.setLoading = setLoading;

            scope.dragControlListeners = {};
            scope.dragControlListeners.orderChanged = function (e) {
                if (scope.sgChangeOrder) {
                    scope.sgChangeOrder(scope.sgId);
                }
            };

            FileUploader.FileSelect.prototype.isEmptyAfterSelection = function () {
                return true;
            };

            scope.imageObjectName = "originalImage";
            scope.loadingObjectName = "loading";

            function upload (file, index) {
                if (scope.sgUploadFunc) {
                    scope.sgUploadFunc(file, function (progressing) {
                        var progress = progressing.loaded / progressing.total;
                        if (!scope.sgModel[index][scope.loadingObjectName].loadingHandler) {
                            setLoading(index);
                        }
                        if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                            scope.sgModel[index][scope.loadingObjectName].loadingHandler.animate(progress);
                        } else {
                            scope.$apply(function () {
                                scope.sgModel[index][scope.loadingObjectName].loadingHandler.animate(progress);
                            });
                        }
                    }, function (status, data) {
                        if (status == 201) {
                            if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                                scope.sgModel[index] = data;
                                if (scope.sgChangeOrder) {
                                    scope.sgChangeOrder(scope.sgId);
                                }
                            } else {
                                scope.$apply(function () {
                                    scope.sgModel[index] = data;
                                    if (scope.sgChangeOrder) {
                                        scope.sgChangeOrder(scope.sgId);
                                    }
                                });
                            }
                        } else {

                        }
                    });
                }
            }

            function setLoading (index) {
                scope.sgModel[index][scope.loadingObjectName].loadingHandler = new ProgressBar.Circle('#' + scope.sgId + index, {
                    color: "#41464c",
                    strokeWidth: 8,
                    trailWidth: 4,
                    easing: 'linear',
                    duration: 300,
                    text: {
                        autoStyleContainer: false
                    },
                    from: {
                        color: '#e4e7ed',
                        width: 4
                    },
                    to: {
                        color: '#41464c',
                        width: 8
                    },
                    step: function (state, circle) {
                        circle.path.setAttribute('stroke', state.color);
                        circle.path.setAttribute('stroke-width', state.width);

                        var value = Math.round(circle.value() * 100);
                        if (value === 0) {
                            circle.setText('');
                        } else {
                            circle.setText(value);
                        }
                    }
                });
            }

            scope.imageUploader = new FileUploader();
            scope.imageUploader.onAfterAddingAll = function (items) {
                if (scope.sgUploadFlag) {
                    var files = [];
                    for (var i=0; i<items.length; i++) {
                        if (imageExp.test(items[i]._file.type)) {
                            files.push(items[i]._file);
                        } else {
                            scope.imageUploader.clearQueue();
                            return dialogHandler.show(false, translate("wrongImageFile"), false, true);
                        }
                    }

                    if (files.length > 0 && scope.sgUploadFunc) {
                        files.forEach(function (file) {

                            var body = {};
                            body[scope.loadingObjectName] = {};
                            scope.sgModel.push(body);

                            var modelIndex = scope.sgModel.length - 1;

                            (function (inputFile, index) {
                                upload(inputFile, index);
                            })(file, modelIndex);

                        });
                    }
                } else {
                    scope.imageUploader.clearQueue();
                }
            };

            function detailImage (imageObject) {
                imageModalManager.setImage(imageObject[scope.imageObjectName]);
                var image = new Image();
                image.onload = function () {
                    var $window = $(window);
                    var maxWidth = $window.width();
                    var maxHeight = $window.height();
                    var width = this.width;
                    var height = this.height;
                    if (width > maxWidth) {
                        if (maxWidth > OVER_SIZE_MARGIN) {
                            width = maxWidth - OVER_SIZE_MARGIN;
                        } else {
                            width = maxWidth;
                        }
                        height = Math.floor(height * width / this.width);
                    }
                    if (height > maxHeight) {
                        if (maxHeight > OVER_SIZE_MARGIN) {
                            height = maxHeight - OVER_SIZE_MARGIN;
                        } else {
                            height = maxHeight;
                        }
                        width = Math.floor(width * height / this.height);
                    }
                    modalHandler.openModal(scope.sgModalKey, "image-detail", "contents", {
                        width: width + "px",
                        height: height + 50 + "px"
                    });
                };
                image.src = imageUrl(imageObject[scope.imageObjectName], 'l');
            }

            function deleteImage (index) {
                scope.sgModel.splice(index, 1);
                if (scope.sgDeleteItem) {
                    scope.sgDeleteItem(scope.sgId);
                }
            }
        }
    }
}