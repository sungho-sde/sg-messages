export default function sgPageNumber(metaManager) {
    "ngInject";

    var templatePath = metaManager.std.templatePath;
    var countPerPageList = 5;

    function setParams(size, count, currentPageString) {

        var currentPage = parseInt(currentPageString);

        var totalPage = Math.ceil(count / size);

        var isFirstPage = currentPage <= countPerPageList;
        var rest = totalPage % countPerPageList;

        if (rest == 0) {
            rest = 5;
        }

        var isLastPage = currentPage > (totalPage - rest);

        if (totalPage <= countPerPageList) {
            isLastPage = true;
        }

        var pageNumbers = [];
        var selectedPageIndex;

        var frontNumber;
        var rearNumber;
        var temp = currentPageString.split('');

        var currentStartPage;
        var currentEndPage;

        if (currentPageString != '10' && currentPageString.length > 1) {

            frontNumber = currentPageString.substr(0, currentPageString.length - 1);
            rearNumber = temp[temp.length - 1];

            if (rearNumber > 5) {
                currentStartPage = parseInt(frontNumber + '6');
                currentEndPage = parseInt(parseInt(frontNumber) + 1 + '0');
            } else {

                if (parseInt(rearNumber) == 0) {
                    currentEndPage = parseInt(currentPageString);
                    currentStartPage = parseInt(currentPageString) - 4;
                } else {
                    currentStartPage = parseInt(frontNumber + '1');
                    currentEndPage = parseInt(frontNumber + '5');
                }

            }

        } else {

            frontNumber = currentPageString;

            if (currentPageString == '10' || frontNumber > 5) {
                currentStartPage = 6;
                currentEndPage = 10;
            } else {
                currentStartPage = 1;
                currentEndPage = 5;
            }

        }


        for (var i = currentStartPage; i <= currentEndPage && i <= totalPage; i++) {
            pageNumbers.push(i);

            if (currentPage == i) {
                selectedPageIndex = i;
            }
        }

        return {
            pageNumbers: pageNumbers,
            selectedPageIndex: selectedPageIndex,
            isFirstPage: isFirstPage,
            isLastPage: isLastPage,
            totalPage: totalPage
        };

    }

    return {
        restrict: 'E',
        scope: {
            size: '=',
            total: '=',
            currentPageString: '=',
            func: '='
        },
        templateUrl: templatePath + 'main/directives/sg-page-number/app.main.sg-page-number.html',
        link: function (scope, element, attr) {
            scope.pagination = setParams(scope.size, scope.total, scope.currentPageString.toString());

            scope.$watch('size', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.pagination = setParams(scope.size, scope.total, scope.currentPageString.toString());
                }
            }, true);

            scope.$watch('total', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.pagination = setParams(scope.size, scope.total, scope.currentPageString.toString());
                }
            }, true);

            scope.$watch('currentPageString', function (newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.pagination = setParams(scope.size, scope.total, scope.currentPageString.toString());
                }
            }, true);
            scope.goPage = scope.func;

        }
    }
}