﻿var mdt = angular.module('ag-million-table', [])

mdt.constant('mdtConfig', {
    list: {
        original: [],
        display: [],
        scrolled: []
    },
    pagination: {
        template: 'template/smart-table/pagination.html',
        itemsByPage: 10,
        displayedPages: 5
    },
    search: {
        delay: 400, // ms
        inputEvent: 'input'
    },
    select: {
        mode: 'single',
        selectedClass: 'st-selected'
    },
    filter: {
        map: [],
        text: ''
    },
    sort: {
        order: [],
        ascentClass: 'st-sort-ascent',
        descentClass: 'st-sort-descent',
        descendingFirst: false,
        skipNatural: false,
        delay: 300
    },
    scroll: {
        rownum: {
            initial: 30,
            additional: 30,
            current: 30
        }
    },
    pipe: {
        delay: 100 //ms
    }
});

mdt.directive("agMillionTable", ['JSONCreationService', 'vsscrollbarEvent', function (JSONCreationService, vsscrollbarEvent) {
    return {
        restrict: 'EA',
        replace: true,
        scope: false,
        templateUrl: '/custom/html/agMillionTable.html',
        compile: function (element, attr) {
            return function (scope, element, attr, ctrl) {
                scope.visibleItems = [];
                scope.filterText = '';
                scope.showObject = 1;

                scope.topIndex = 0;
                scope.maxIndex = 0;
                scope.topPos = 0;
                scope.maxPos = 0;
                scope.filteredPageCount = 0;
                scope.filteredItemCount = 0;

                scope.responseData = [];

                scope.$watchCollection('responseData', function (response) {
                    scope.topIndex = response.topIndex;
                    scope.maxIndex = response.maxIndex;
                    scope.topPos = response.topPos;
                    scope.maxPos = response.maxPos;
                    scope.filteredPageCount = response.filteredPageCount;
                    scope.filteredItemCount = response.filteredItemCount;
                    scope.visibleItems = response.visibleItems;
                });

                // Example function: list item clicked
                scope.itemClicked = function (index, item) {
                    var text = 'Clicked item: \"' + item.name + '\". Its index in the page is: \"' + index + '\" and the total index is: \"' + (scope.topIndex + index) + '\".';
                    scope.clickedText = text;
                };

                // Filtering
                scope.$watch('filterText', function (newValue, oldValue) {
                    nif(newValue !== oldValue) {
                        // Filter value from all properties (id, code and name) because item is an object
                        vsscrollbarEvent.filter(scope, newValue);
                    }
                });

                scope.allItems = JSONCreationService.execute();

                //// Generate test items (array of objects)
                //var chars = "ABCDEFGHIJKLMNOPQURSTUVWXYZ";

                //scope.allItems = [];
                //for (var i = 0; i < 1000; i++) {
                //    var rndcode = chars.substr(Math.floor(Math.random() * 27), 1) + chars.substr(Math.floor(Math.random() * 27), 1);
                //    scope.allItems.push({ id: i, code: rndcode, name: 'Item #' + (i + 1) });
                //}
            }
        }
    }
}]);

mdt.directive('mildTableTh', ['mdtConfig', '$rootScope', function (mdtConfig, $rootScope) {
    return {
        restrict: 'EA',
        //require: '^div',
        scope: {
            predicate: '@',
            title: '@',
            colwidth: '@',
            color: '@',
            enable: '='
        },
        templateUrl: '/custom/html/TableColumnFilter.html',
        compile: function (element, attr) {
            //#region column size
            initializeColumn(element);
            function initializeColumn(element) {
                //element[0].style.width = attr.colwidth + '%';
                element[0].style.width = attr.colwidth + 'px';
                // element[0].style.backgroundColor = attr.color;
            }
            //#endregion

            return function (scope, element, attr, tableFilterCtrl) {
                //in case of using title only without filter
                if (!scope.enable) return;

                initialize();

                //#region initialize
                function initialize() {
                    //initialize collection
                    //create on/off check items
                    scope.items = createItems();

                    ////set this column state to parent filter container .
                    //updateParentFilterContainer();
                }
                //#endregion

                //#region crate check on/off items for filter
                function createItems() {
                    //extract predicate and get uniq and sort.
                    let distinctRows = createDistinctRows(mdtConfig.list.original);
                    let map = createItemsMap(distinctRows);
                    mdtConfig.filter.map.push({ predicate: attr.predicate, map: map });
                    return map;
                }

                //function createItems_showing(rows) {
                //    //extract predicate and get uniq and sort.
                //    let distinctRows = createDistinctRows(rows);
                //    return createItemsMap(distinctRows)
                //}

                //function createItems_checked() {
                //    //extract predicate and get uniq and sort.
                //    let distinctRows = createDistinctRows(scope.original);
                //    return createItemsMap(distinctRows)
                //}

                function createDistinctRows(rows) {
                    return _.sortBy(_.uniq(_.flatten(_.pluck(rows, scope.predicate))));
                }

                function createItemsMap(distinctRows) {
                    //Add 'All' to list head.
                    distinctRows.unshift('Select All');
                    //convert for checkbox item list.
                    return _.map(distinctRows, function (n) {
                        let item = {
                            value: n, //
                            selected: true
                        }
                        return item;
                    });
                }
                //#endregion

                ////#region update check on/off state on filter container
                //function updateParentFilterContainer() {
                //    tableFilterCtrl.getFilterInfoContainer()[scope.predicate] = scope.items;
                //}
                ////#endregion

                //#region Synchronize 'Select All' and the other item check on/off
                function synchronizeAllSelection() {
                    //filter off item except 'Select All'.
                    let unCheckedElements = _.where(_.rest(scope.items), { selected: false });
                    //Set on/off to 'Select All'
                    _.first(scope.items).selected = (unCheckedElements.length == 0);
                }
                //#endregion

                //#region item click event
                scope.filterChanged = function (element) {
                    if (element.value != 'Select All') {
                        synchronizeAllSelection(element);
                    }
                    else {
                        //Synchronize all items with 'Select All' on/off
                        _.each(_.rest(scope.items), function (item) {
                            item.selected = element.selected;
                        });
                    }
                    let filterInfo = _.findWhere(mdtConfig.filter.map, { predicate: attr.predicate });
                    filterInfo.map = scope.items;

                    //Execute
                    $rootScope.$broadcast('updateMildTable');
                    //updateParentFilterContainer();
                    //tableFilterCtrl.executeFilter(element, scope.predicate);
                };
                //#endregion

                //#region button event
                //Sort
                scope.sort = function (isAsc) {
                    let sortInfo = _.findWhere(mdtConfig.sort.order, { predicate: scope.predicate });
                    mdtConfig.sort.order.push({ asc: isAsc, predicate: scope.predicate });

                    //if (sortInfo) {
                    //    sortInfo = { asc: isAsc, predicate: scope.predicate };
                    //}
                    //else {
                    //    mdtConfig.sort.order.push({ asc: isAsc, predicate: scope.predicate });
                    //}

                    //Execute
                    $rootScope.$broadcast('updateMildTable');
                };

                ////Clear
                //scope.clear = function () {
                //    //Recover State
                //    tableFilterCtrl.executeInitialize();
                //    //Check All
                //    let all = _.first(scope.items);
                //    all.selected = true;
                //    scope.filterChanged(all);
                //};

                ////Text Search
                //scope.textSearch = function (text) {
                //    tableFilterCtrl.executeTextSearch(text, scope.predicate);
                //};

                ////Show filter items only showed itemson table.
                //scope.showListingItem = function () {
                //    let list = tableFilterCtrl.getShowingCollection();
                //    scope.items = createItems_showing(list);
                //    updateParentFilterContainer();
                //};

                ////Show filter items only checked items on table.
                //scope.showCheckedItem = function () {
                //    updateParentFilterContainer();
                //};
                ////#endregion

                //#region synchronize item check on/off with rows when clicked dropdown
                scope.synchronizeCheckItems = function () {
                    //createItems();

                    let rows = mdtConfig.list.display;
                    //let rows = tableFilterCtrl.getShowingCollection();

                    _.each(_.rest(scope.items), function (item) {
                        let visibleRow = _.filter(rows, function (row) {
                            return row.visible && item.value == row[scope.predicate]
                        });

                        item.selected = (visibleRow.length > 0);
                    });

                    synchronizeAllSelection();
                }
                //#endregion

                //scope.$on('updateFilterInfo', function (event, filterInfoContainer) {
                //    tableFilterCtrl.getFilterInfoContainer()[scope.predicate] = filterInfoContainer[scope.predicate]
                //});
            }
        }
    };
}]);