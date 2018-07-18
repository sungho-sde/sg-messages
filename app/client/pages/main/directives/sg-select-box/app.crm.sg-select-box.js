export default function sgSelectBox ($rootScope, $filter, metaManager) {
    "ngInject";

    var templatePath = metaManager.std.templatePath;
    var isIE = !!document.documentMode;

    return {
        restrict: 'E',
        scope: {
            sgId: '@',
            sgName: '@',
            sgEnum: '=',
            sgModel: '=',
            sgOption: '='
        },
        templateUrl: templatePath + 'main/directives/sg-select-box/app.crm.sg-select-box.html',
        link: function (scope, element, attr) {
            var translate = $filter('translate');
            var PX = "px";
            var $target = $(element[0]);
            var $focus = $(element[0]).children('.sg-select-box');
            var $enumItem = $(element[0].children[0]).children(".sg-enum-item");
            var $span = $(element[0].children[0]).children(".sg-current-item").children("span");
            var $arrow = $(element[0].children[0]).children(".sg-current-item").children(".sg-arrow-down");
            var itemHeight = 28;

            var name = scope.sgName;

            scope.enumItems = angular.copy(scope.sgEnum);
            scope.enumTranslateItems = [];
            if (scope.enumItems && scope.enumItems.length) {
                scope.enumItems.forEach(function (item) {
                    scope.enumTranslateItems.push(translate(item));
                });
            }
            scope.currentItem = '';
            scope.currentIndex = null;
            scope.focus = false;
            scope.viewItems = false;

            scope.select = select;
            scope.view = view;

            scope.$watch('sgModel', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    if (scope.sgModel && scope.enumItems.indexOf(scope.sgModel) != -1) {
                        scope.currentItem = translate(angular.copy(scope.sgModel));
                        scope.currentIndex = scope.enumItems.indexOf(scope.sgModel);
                        scope.placeholder = false;

                        var overHeight = (scope.currentIndex + 1) * itemHeight + 4;
                        var scrollHeight = overHeight - $enumItem.height();
                        if ((overHeight > $enumItem.height() && scrollHeight > $enumItem.scrollTop()) || overHeight < $enumItem.scrollTop()) {
                            $enumItem.scrollTop(scrollHeight);
                        }
                    } else {
                        $enumItem.scrollTop(0);
                        scope.currentItem = translate(name);
                        if (scope.sgOption) {
                            if (scope.sgOption.totalSelect) {
                                scope.currentIndex = 0;
                                scope.placeholder = false;
                            } else if (scope.sgOption.noSelect) {
                                scope.currentItem = translate(scope.enumItems[0]);
                                scope.currentIndex = 0;
                                scope.placeholder = false;
                            } else {
                                scope.currentIndex = null;
                                scope.placeholder = true;
                            }
                        } else {
                            scope.currentIndex = null;
                            scope.placeholder = true;
                        }
                    }
                }
            }, true);

            scope.$watch('sgEnum', function (newVal, oldVal) {
                scope.enumItems = angular.copy(scope.sgEnum);
                scope.enumTranslateItems = [];

                scope.enumItems.forEach(function (item) {
                    scope.enumTranslateItems.push(translate(item));
                });

                if (scope.sgOption) {
                    if (scope.sgOption.totalSelect) {
                        scope.enumItems.unshift(translate('selectBoxTotal') + ' ' + translate(scope.sgName));
                        scope.enumTranslateItems.unshift(translate('selectBoxTotal') + ' ' + translate(scope.sgName));
                    }
                    if (scope.sgOption.noSelect) {
                        scope.enumItems.unshift(translate('selectBoxNo'));
                        scope.enumTranslateItems.unshift(translate('selectBoxNo'));
                    }
                }

                if (scope.sgModel && scope.enumItems.indexOf(scope.sgModel) != -1) {
                    scope.currentItem = translate(angular.copy(scope.sgModel));
                    scope.currentIndex = scope.enumItems.indexOf(scope.sgModel);
                    scope.placeholder = false;

                    var overHeight = (scope.currentIndex + 1) * itemHeight + 4;
                    var scrollHeight = overHeight - $enumItem.height();
                    if ((overHeight > $enumItem.height() && scrollHeight > $enumItem.scrollTop()) || overHeight < $enumItem.scrollTop()) {
                        $enumItem.scrollTop(scrollHeight);
                    }
                } else {
                    $enumItem.scrollTop(0);
                    scope.currentItem = translate(name);
                    scope.currentIndex = null;
                    scope.placeholder = true;
                }
            }, true);

            if (scope.sgOption) {
                if (scope.sgOption.float) $target.css("float", scope.sgOption.float);
                if (scope.sgOption.margin) {
                    $target.css("margin", scope.sgOption.margin);
                }
                if (scope.sgOption.width) {
                    if (typeof scope.sgOption.width == "number") {
                        $target.css("width", scope.sgOption.width + PX);
                    } else if (typeof scope.sgOption.width == "string") {
                        $target.css("width", scope.sgOption.width);
                    }
                }
                if (scope.sgOption.maxWidth) {
                    if (typeof scope.sgOption.maxWidth == "string") {
                        $target.css("max-width", scope.sgOption.maxWidth);
                    }
                }
                if (scope.sgOption.height) {
                    $target.css("height", scope.sgOption.height + PX);
                    $span.css("line-height", (scope.sgOption.height - 2) + PX);
                    $arrow.css("top", ((scope.sgOption.height - 14) / 2) + PX);
                    $enumItem.css("top", (scope.sgOption.height + 2) + PX);
                }
                if (scope.sgOption.itemHeight) {
                    itemHeight = scope.sgOption.itemHeight - 2;
                    scope.itemHeight = "height: " + (scope.sgOption.itemHeight - 2) + PX + ';' + "line-height: " + (scope.sgOption.itemHeight - 2) + PX + ';';
                }
                if (scope.sgOption.itemMaxHeight) {
                    $enumItem.css("max-height", scope.sgOption.itemMaxHeight + PX);
                }
                if (scope.sgOption.totalSelect) {
                    scope.enumItems.unshift(translate('selectBoxTotal') + ' ' + translate(scope.sgName));
                    scope.enumTranslateItems.unshift(translate('selectBoxTotal') + ' ' + translate(scope.sgName));
                }
                if (scope.sgOption.noSelect) {
                    scope.enumItems.unshift(translate('selectBoxNo'));
                    scope.enumTranslateItems.unshift(translate('selectBoxNo'));
                }
            }

            if (scope.sgModel && scope.enumItems && scope.enumItems.indexOf(scope.sgModel) != -1) {
                scope.currentItem = translate(angular.copy(scope.sgModel));
                scope.currentIndex = scope.enumItems.indexOf(scope.sgModel);
                scope.placeholder = false;
            } else {
                scope.currentItem = translate(name);
                if (scope.sgOption) {
                    if (scope.sgOption.totalSelect) {
                        scope.currentIndex = 0;
                        scope.placeholder = false;
                    } else if (scope.sgOption.noSelect) {
                        scope.currentIndex = 0;
                        scope.placeholder = true;
                    } else {
                        scope.placeholder = true;
                    }
                } else {
                    scope.placeholder = true;
                }
            }

            function view (e) {
                if (scope.focus && scope.viewItems) {
                    scope.focus = false;
                    scope.viewItems = false;
                } else {
                    scope.focus = true;
                    if (scope.enumItems && scope.enumItems.length) {
                        scope.viewItems = true;

                        if (scope.sgModel && scope.enumItems.indexOf(scope.sgModel) != -1) {
                            scope.currentItem = translate(angular.copy(scope.sgModel));
                            scope.currentIndex = scope.enumItems.indexOf(scope.sgModel);
                        }

                        if (!$enumItem.hasClass("sg-view")) $enumItem.addClass("sg-view");
                        var overHeight = (scope.currentIndex + 1) * itemHeight + 4;
                        var scrollHeight = overHeight - $enumItem.height();
                        if ((overHeight > $enumItem.height() && scrollHeight > $enumItem.scrollTop()) || overHeight < $enumItem.scrollTop()) {
                            $enumItem.scrollTop(scrollHeight);
                        }
                    }
                }
            }

            function select (index) {
                if (scope.viewItems) {
                    scope.currentIndex = index;
                    if (index == 0 && scope.sgOption && (scope.sgOption.totalSelect || scope.sgOption.noSelect)) {
                        scope.sgModel = '';
                        if (scope.sgOption.totalSelect) {
                            scope.currentItem = translate(name);
                        } else {
                            scope.currentItem = translate(scope.enumItems[index]);
                        }
                    } else {
                        scope.sgModel = scope.enumItems[index];
                        scope.currentItem = translate(scope.enumItems[index]);
                    }
                    scope.placeholder = false;
                    scope.viewItems = false;
                } else {
                    if (scope.enumItems && scope.enumItems.length) {
                        scope.viewItems = true;
                    }
                }
            }

            function focus () {
                scope.focus = true;
            }

            function focusin () {
                scope.viewItems = true;
            }

            function close (e) {
                scope.focus = false;
                scope.viewItems = false;
            }

            $focus.bind('focus', function (e) {
                if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                    focus();
                } else {
                    scope.$apply(function () {
                        focus();
                    });
                }
            });

            if (isIE) {
                $focus.bind('focusin', function (e) {
                    if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                        focusin();
                    } else {
                        scope.$apply(function () {
                            focusin();
                        });
                    }
                });
            }

            $focus.bind('blur', function (e) {
                if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                    close();
                } else {
                    scope.$apply(function () {
                        close();
                    });
                }
            });

            $focus.bind('focusout', function (e) {
                if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                    close();
                } else {
                    scope.$apply(function () {
                        close();
                    });
                }
            });

            $focus.bind('keydown', function (e) {
                var keyCode = (e.keyCode ? e.keyCode : e.which);

                switch (keyCode) {
                    case 27:
                        if (scope.focus) {
                            e.stopPropagation();
                        }
                        if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                            close();
                        } else {
                            scope.$apply(function () {
                                close();
                            });
                        }
                        return false;
                    case 13:
                        if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                            select(scope.currentIndex);
                        } else {
                            scope.$apply(function () {
                                select(scope.currentIndex);
                            });
                        }
                        return false;
                    case 32:
                        if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                            select(scope.currentIndex);
                        } else {
                            scope.$apply(function () {
                                select(scope.currentIndex);
                            });
                        }
                        return false;
                    case 40:
                        if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                            down();
                        } else {
                            scope.$apply(function () {
                                down();
                            });
                        }
                        return false;
                    case 38:
                        if ($rootScope.$$phase == '$apply' || $rootScope.$$phase == '$digest') {
                            up();
                        } else {
                            scope.$apply(function () {
                                up();
                            });
                        }
                        return false;
                }
            });

            function down () {
                if (scope.viewItems && scope.enumItems.length) {
                    if (scope.currentIndex === null) {
                        scope.currentIndex = 0;
                    } else {
                        if (scope.currentIndex < scope.enumItems.length - 1) {
                            scope.currentIndex++;
                            var overHeight = (scope.currentIndex + 1) * itemHeight + 4;
                            var scrollHeight = overHeight - $enumItem.height();
                            if ((overHeight > $enumItem.height() && scrollHeight > $enumItem.scrollTop()) || overHeight < $enumItem.scrollTop()) {
                                $enumItem.scrollTop(scrollHeight);
                            }
                        }
                    }
                }
            }

            function up () {
                if (scope.viewItems && scope.enumItems.length) {
                    if (scope.currentIndex !== null && scope.currentIndex > 0) {
                        scope.currentIndex--;
                        var itemHeights = (scope.currentIndex) * itemHeight;
                        if ($enumItem.scrollTop() > itemHeights || $enumItem.scrollTop() + $enumItem.height() < itemHeights) {
                            $enumItem.scrollTop(itemHeights);
                        }
                    }
                }
            }
        }
    }
}