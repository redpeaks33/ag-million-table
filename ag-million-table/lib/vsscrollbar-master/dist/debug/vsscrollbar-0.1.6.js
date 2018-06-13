/* 
*  Name: vsscrollbar 
*  Description: Virtual scroll with filtering and custom scrollbar - AngularJS reusable UI component 
*  Homepage: http://kekeh.github.io/vsscrollbar 
*  Version: 0.1.6 
*  Author: kekeh 
*  License: MIT 
*  Date: 2016-01-13 
*/ 
angular.module('template-vsscrollbar-0.1.6.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put("templates/vsscrollbar.html",
    "<table class=vsscrollbarcontainer ng-show=\"filteredItems.length > 0\" style=border-collapse:separate;border-spacing:0;padding:0;height:100%><tr><td style=width:100%;padding:0;vertical-align:top><div class=vsscrollbarcontent ng-style=\"{'margin': scrollbarVisible ? '1px 0 1px 1px' : '1px'}\" style=overflow-y:hidden;padding:0;outline:0 ng-transclude></div></td><td style=padding:0;height:100%><div class=vsscrollbar ng-show=scrollbarVisible style=float:right;height:100%;padding:0;margin:1px><div class=vsscrollbox tabindex=0 ng-focus=scrollBoxFocus() ng-blur=scrollBoxBlur() ng-style=\"{'height': boxHeight + 'px'}\" ng-click=$event.stopPropagation() style=position:relative;padding:0;outline:0></div></div></td></tr></table>");
}]);

angular.module('vsscrollbar', ["template-vsscrollbar-0.1.6.html"])
    .constant('vsscrollbarConfig', {
        ITEMS_IN_PAGE: 6,
        SCROLLBAR_HEIGHT: 0,
        SCROLLBOX_MIN_HEIGHT: 18
    })
    .factory('vsscrollbarEvent', function () {
        var factory = {};
        factory.setIndex = function ($scope, index) {
            broadcast($scope, 'setIndex', index);
        };

        factory.setPosition = function ($scope, position) {
            broadcast($scope, 'setPosition', position);
        };

        factory.filter = function ($scope, filterStr) {
            broadcast($scope, 'filter', filterStr);
        };

        factory.addItem = function ($scope, index, item) {
            broadcast($scope, 'addItem', {index: index, item: item});
        };

        factory.updateItem = function ($scope, index, item) {
            broadcast($scope, 'updateItem', {index: index, item: item});
        };

        factory.deleteItem = function ($scope, index) {
            broadcast($scope, 'deleteItem', index);
        };

        function broadcast($scope, type, data) {
            $scope.$broadcast('vsmessage', {type: type, value: data});
        };
        return factory;
    })
    .service('vsscrollbarService', function () {
        this.calcIndex = function (pos, maxIndex, maxPos) {
            var idx = 0;
            if (this.checkIsMaxPos(pos, maxPos)) {
                idx = maxIndex;
            }
            else if (pos > 0) {
                idx = this.validateIndex(Math.round(pos / maxPos * maxIndex), maxIndex);
            }
            return idx;
        };

        this.calcScrollPos = function (index, maxIndex, maxPos) {
            var pos = 0;
            if (index > 0) {
                if (this.checkIsMaxIndex(index, maxIndex)) {
                    pos = maxPos;
                }
                else {
                    pos = Math.round(index / maxIndex * maxPos);
                }
            }
            return this.validatePos(pos, maxPos, index, maxIndex);
        };

        this.validateIndex = function (index, maxIndex) {
            return index <= 0 ? 0 : this.checkIsMaxIndex(index, maxIndex) ? maxIndex : index;
        };

        this.validatePos = function (pos, maxPos, index, maxIndex) {
            if (angular.isUndefined(index) || angular.isUndefined(maxIndex)) {
                return pos <= 0 ? 0 : pos >= maxPos ? maxPos : pos;
            }
            return pos <= 0 && index > 0 ? 1 : pos >= maxPos && index < maxIndex ? maxPos - 1 : pos;
        };

        this.checkIsMaxIndex = function (index, maxIndex) {
            return index >= maxIndex;
        };

        this.checkIsMaxPos = function (pos, maxPos) {
            return pos >= maxPos;
        };
    })
    .directive('vsscrollbar', ['$filter', '$timeout', '$document', 'vsscrollbarService', 'vsscrollbarConfig', function ($filter, $timeout, $document, vsscrollbarService, vsscrollbarConfig) {
        return {
            restrict: 'AE',
            multiElement: true,
            scope: {
                ngModel: '=?',
                items: '=items',
                onScrollChangeFn: '&',
                onFocusScrollboxFn: '&'
            },
            transclude: true,
            templateUrl: 'templates/vsscrollbar.html',
            link: function (scope, element, attrs) {
                scope.filteredItems = [];
                var scrollbarContent = angular.element(element[0].querySelector('.vsscrollbarcontent'));
                var scrollbar = angular.element(element[0].querySelector('.vsscrollbar'));
                var scrollbox = scrollbar.children();
                var itemsInPage = !angular.isUndefined(attrs.itemsInPage) ? scope.$eval(attrs.itemsInPage) : vsscrollbarConfig.ITEMS_IN_PAGE;
                var scrollbarHeight = !angular.isUndefined(attrs.height) ? scope.$eval(attrs.height) : vsscrollbarConfig.SCROLLBAR_HEIGHT;
                var scrollStart = 0, index = 0, maxIdx = 0, position = 0, maxPos = 0;
                var filterStr = '';

                scope.boxHeight = vsscrollbarConfig.SCROLLBOX_MIN_HEIGHT;
                scope.scrollbarVisible = true;

                scope.scrollBoxFocus = function () {
                    scope.onFocusScrollboxFn({focused: true});
                };

                scope.scrollBoxBlur = function () {
                    scope.onFocusScrollboxFn({focused: false});
                };

                scrollbox.on('mousedown touchstart', onScrollMoveStart);

                function onScrollMoveStart(event) {
                    event.preventDefault();
                    scrollStart = angular.isUndefined(event.changedTouches) ? event.clientY - position : event.changedTouches[0].clientY - position;
                    $document.on(angular.isUndefined(event.changedTouches) ? 'mousemove' : 'touchmove', onScrollMove);
                    $document.on(angular.isUndefined(event.changedTouches) ? 'mouseup' : 'touchend', onScrollMoveEnd)
                };

                function onScrollMove(event) {
                    var pos = angular.isUndefined(event.changedTouches) ? event.clientY - scrollStart : event.changedTouches[0].clientY - scrollStart;
                    setScrollPos(vsscrollbarService.validatePos(pos, maxPos));
                    scope.$apply();
                };

                function onScrollMoveEnd(event) {
                    $document.off(angular.isUndefined(event.changedTouches) ? 'mousemove' : 'touchmove', onScrollMove);
                    $document.off(angular.isUndefined(event.changedTouches) ? 'mouseup' : 'touchend', onScrollMoveEnd);
                };

                scrollbarContent.on('touchstart', onTouchStartList);

                function onTouchStartList(event) {
                    scrollStart = event.changedTouches[0].clientY;
                    $document.on('touchmove', onTouchMoveList);
                    $document.on('touchend', onTouchEndList);
                };

                function onTouchMoveList(event) {
                    event.preventDefault();
                    var pos = event.changedTouches[0].clientY;
                    indexChange(pos < scrollStart ? itemsInPage : -itemsInPage);
                    scrollStart = pos;
                    scope.$apply();
                };

                function onTouchEndList() {
                    $document.off('touchmove', onTouchMoveList);
                    $document.off('touchend', onTouchEndList);
                };

                scrollbar.on('click', onScrollbarClick);

                function onScrollbarClick(event) {
                    var value = event.offsetY || event.layerY;
                    setScrollPos(vsscrollbarService.validatePos(value < scope.boxHeight ? 0 : value, maxPos));
                    scope.$apply();
                }

                scrollbox.on('click', onScrollboxClick);

                function onScrollboxClick() {
                    scrollbox[0].focus();
                }

                scrollbarContent.on('mousewheel DOMMouseScroll', onScrollMouseWheel);
                scrollbar.on('mousewheel DOMMouseScroll', onScrollMouseWheel);

                function onScrollMouseWheel(event) {
                    var event = window.event || event;
                    event.preventDefault();
                    var isDown = (event.wheelDelta || -event.detail) <= 0;
                    indexChange(isDown ? itemsInPage : -itemsInPage);
                }

                scrollbox.on('keydown', onKeydown);

                function onKeydown(event) {
                    if (event.which === 38 || event.which === 40) {
                        event.preventDefault();
                        indexChange(event.which === 38 ? -itemsInPage : itemsInPage);
                    }
                }

                scope.$on('vsmessage', onScrollbarMessage);

                function onScrollbarMessage(event, data) {
                    if (data.type === 'setIndex' && data.value !== index && data.value >= 0) {
                        setIndex(Math.round(data.value), true);
                    }
                    else if (data.type === 'setPosition' && data.value !== position && data.value >= 0) {
                        setScrollPos(vsscrollbarService.validatePos(Math.round(data.value), maxPos));
                    }
                    else if (data.type === 'filter') {
                        filterStr = data.value;
                        filterItems(filterStr, 0);
                    }
                    else if (data.type === 'addItem' && data.value.index >= 0 && data.value.index <= scope.items.length) {
                        scope.items.splice(data.value.index, 0, data.value.item);
                        filterItems(filterStr, index);
                    }
                    else if (data.type === 'updateItem' && data.value.index >= 0 && data.value.index < scope.items.length) {
                        scope.items[data.value.index] = data.value.item;
                        filterItems(filterStr, index);
                    }
                    else if (data.type === 'deleteItem' && data.value >= 0 && data.value < scope.items.length) {
                        scope.items.splice(data.value, 1);
                        filterItems(filterStr, index);
                    }
                }

                scope.$on('$destroy', function () {
                    scrollbox.off('mousedown touchstart', onScrollMoveStart);
                    scrollbarContent.off('touchstart', onTouchStartList);
                    scrollbar.off('click', onScrollbarClick);
                    scrollbox.off('click', onScrollboxClick);
                    scrollbarContent.off('mousewheel DOMMouseScroll', onScrollMouseWheel);
                    scrollbar.off('mousewheel DOMMouseScroll', onScrollMouseWheel);
                    scrollbox.off('keydown', onKeydown);
                });

                function filterItems(filter, idx) {
                    scope.filteredItems = (filter === '') ? scope.items : $filter('filter')(scope.items, filter);
                    scope.scrollbarVisible = scope.filteredItems.length > itemsInPage;
                    initScrollValues();
                    setIndex(idx, false);
                }

                function initScrollValues() {
                    var height = Math.floor(scrollbarHeight / (scope.filteredItems.length / itemsInPage));
                    scope.boxHeight = height < vsscrollbarConfig.SCROLLBOX_MIN_HEIGHT ? vsscrollbarConfig.SCROLLBOX_MIN_HEIGHT : height;
                    maxIdx = scope.filteredItems.length - itemsInPage < 0 ? 0 : scope.filteredItems.length - itemsInPage;
                    maxPos = scrollbarHeight - scope.boxHeight < 0 ? 0 : scrollbarHeight - scope.boxHeight;
                }

                function setScrollPos(pos) {
                    if ((pos = Math.round(pos)) !== position) {
                        position = pos;
                        index = vsscrollbarService.calcIndex(position, maxIdx, maxPos);
                        moveScrollBox();
                    }
                }

                function setIndex(idx, verifyChange) {
                    if ((idx = vsscrollbarService.validateIndex(idx, maxIdx)) !== index || !verifyChange) {
                        index = idx;
                        position = vsscrollbarService.calcScrollPos(index, maxIdx, maxPos);
                        moveScrollBox();
                    }
                }

                function indexChange(idx) {
                    setIndex(index + idx, true);
                    scope.$apply();
                }

                function moveScrollBox() {
                    scrollbox.css('top', position + 'px');
                    onScrollChange();
                }

                function onScrollChange() {
                    var responseData = {
                        topIndex: index,
                        maxIndex: maxIdx,
                        topPos: position,
                        maxPos: maxPos,
                        filteredPageCount: scope.filteredItems.length / itemsInPage,
                        filteredItemCount: scope.filteredItems.length,
                        visibleItems: slice()
                    };
                    scope.onScrollChangeFn(responseData);
                    scope.ngModel = responseData;
                }

                function slice() {
                    return scope.filteredItems.slice(index, index + itemsInPage);
                }

                function init() {
                    scope.filteredItems = scope.items;
                    if (scrollbarHeight === 0) {
                        $timeout(setHeight, 0);
                    }
                    else {
                        scrollbar.css('height', scrollbarHeight + 'px');
                        initScrollValues();
                    }
                    setIndex(0, false);
                }

                function setHeight() {
                    scrollbarHeight = scrollbarContent.prop('offsetHeight');
                    scrollbar.css('height', scrollbarHeight + 'px');
                    initScrollValues();
                }

                init();
            }
        };
    }]);
