describe('vsscrollbar', function() {
    var elm, scope;

    beforeEach(module('vsscrollbar'));

    beforeEach(inject(function($rootScope, $compile, vsscrollbarEvent) {
        scope = $rootScope;

        scope.topIndex = 0, scope.maxIndex = 0, scope.topPos = 0, scope.maxPos = 0, scope.filteredPageCount = 0, scope.filteredPageCount = 0;
        scope.visibleItems = [];
        scope.response = {};
        eventapi = vsscrollbarEvent;

        // generate items to the list
        scope.allItems = [];
        for (var i = 0; i < 201; i++) {
            scope.allItems.push({id: i, name: 'Item #' + (i + 1)});
        }

        // response callback function
        scope.onScrollChange = function (topIndex, maxIndex, topPos, maxPos, filteredPageCount, filteredItemCount, visibleItems) {
            scope.topIndex = topIndex;
            scope.maxIndex = maxIndex;
            scope.topPos = topPos;
            scope.maxPos = maxPos;
            scope.filteredPageCount = filteredPageCount;
            scope.filteredItemCount = filteredItemCount;
            scope.visibleItems = visibleItems;
        };

        elm = angular.element(
            '<vsscrollbar ng-model="response" items="allItems" items-in-page="6" height="6*25"' +
                'on-scroll-change-fn="onScrollChange(topIndex, maxIndex, topPos, maxPos, filteredPageCount, filteredItemCount, visibleItems)">' +
                '<div style="height: 25px;" ng-repeat="item in visibleItems track by $index">' +
                    '<div>{{item}}</div>' +
                '</div>' +
            '</vsscrollbar>');

        $compile(elm)(scope);
        scope.$digest();
    }));

    it("callback response", function () {
        expect(scope.visibleItems.length).toEqual(6);
        expect(scope.topIndex).toEqual(0);
        expect(scope.maxIndex).toEqual(195);
        expect(scope.topPos).toEqual(0);
        expect(scope.maxPos).toEqual(132);
        expect(scope.filteredPageCount).toEqual(33.5);
        expect(scope.filteredItemCount).toEqual(201);
    });

    it("ng-model response", function () {
        expect(scope.response.visibleItems.length).toEqual(6);
        expect(scope.response.topIndex).toEqual(0);
        expect(scope.response.maxIndex).toEqual(195);
        expect(scope.response.topPos).toEqual(0);
        expect(scope.response.maxPos).toEqual(132);
        expect(scope.response.filteredPageCount > 33).toBeTruthy();
        expect(scope.response.filteredPageCount < 34).toBeTruthy();
        expect(scope.response.filteredItemCount).toEqual(201);
    });

    it("set index", function () {
        eventapi.setIndex(scope, scope.maxIndex - 5);
        expect(scope.topIndex).toEqual(scope.maxIndex - 5);
        expect(scope.maxIndex).toEqual(195);
    });

    it("set position", function () {
        eventapi.setPosition(scope, scope.maxPos - 5);
        expect(scope.topPos).toEqual(scope.maxPos - 5);
        expect(scope.maxPos).toEqual(132);
    });

    it("filter", function () {
        eventapi.filter(scope, '23');
        expect(scope.topIndex).toEqual(0);
        expect(scope.maxIndex).toEqual(0);
        expect(scope.topPos).toEqual(0);
        expect(scope.maxPos).toEqual(0);
        expect(scope.filteredPageCount < 1).toBeTruthy();
        expect(scope.filteredItemCount).toEqual(4);
        eventapi.filter(scope, '');
    });

    it("add item", function () {
        eventapi.addItem(scope, 55, {id: 1000, name: 'New item'});
        eventapi.setIndex(scope, 55);
        expect(scope.visibleItems[0].id).toEqual(1000);
        expect(scope.visibleItems[0].name).toEqual('New item');
        eventapi.filter(scope, 'New item');
        expect(scope.filteredItemCount).toEqual(1);
        eventapi.filter(scope, '');
    });

    it("update item", function () {
        eventapi.updateItem(scope, 22, {id: 22, name: 'Updated item'});
        eventapi.setIndex(scope, 22);
        expect(scope.visibleItems[0].id).toEqual(22);
        expect(scope.visibleItems[0].name).toEqual('Updated item');
        eventapi.filter(scope, 'Updated item');
        expect(scope.filteredItemCount).toEqual(1);
        eventapi.filter(scope, '');
    });

    it("delete item", function () {
        eventapi.addItem(scope, 33, {id: 33, name: 'Delete item'});
        eventapi.setIndex(scope, 33);
        expect(scope.visibleItems[0].id).toEqual(33);
        expect(scope.visibleItems[0].name).toEqual('Delete item');
        eventapi.deleteItem(scope, 33);
        eventapi.filter(scope, 'Delete item');
        expect(scope.filteredItemCount).toEqual(0);
        eventapi.filter(scope, '');
    });

    it('vsscrollbarcontainer', function () {
        expect(elm[0].querySelectorAll('.vsscrollbarcontainer').length).toBe(1);
    });

    it('vsscrollbarcontent', function () {
        expect(elm[0].querySelectorAll('.vsscrollbarcontent').length).toBe(1);
    });

    it('vsscrollbar', function () {
        expect(elm[0].querySelectorAll('.vsscrollbar').length).toBe(1);
    });

    it('vsscrollbox', function () {
        expect(elm[0].querySelectorAll('.vsscrollbox').length).toBe(1);
    });
});

