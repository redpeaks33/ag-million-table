var sampleapp = angular.module('sampleapp', ['vsscrollbar']);

// Example 1
sampleapp.controller('vsScrollbarCtrl1', function ($scope, vsscrollbarEvent) {

    $scope.visibleItems = [];
    $scope.filterText = '';

    $scope.topIndex = 0;
    $scope.maxIndex = 0;
    $scope.topPos = 0;
    $scope.maxPos = 0;
    $scope.filteredPageCount = 0;
    $scope.filteredItemCount = 0;

    // Scrollbox focus/blur callback
    $scope.onFocusScrollbox = function (focused) {
        console.log('onFocusScrollbox(): focused: ', focused);
    };

    // Scroll change callback
    $scope.onScrollChange = function (topIndex, maxIndex, topPos, maxPos, filteredPageCount, filteredItemCount, visibleItems) {
        $scope.topIndex = topIndex;
        $scope.maxIndex = maxIndex;
        $scope.topPos = topPos;
        $scope.maxPos = maxPos;
        $scope.filteredPageCount = filteredPageCount;
        $scope.filteredItemCount = filteredItemCount;
        $scope.visibleItems = visibleItems;
    };

    // Example function: list item clicked
    $scope.itemClicked = function (index, item) {
        var text = 'Clicked item: \"' + item + '\". Its index in the page is: \"' + index + '\" and the total index is: \"' + ($scope.topIndex + index) + '\".';
        $scope.clickedText = text;
    };

    // Filtering
    $scope.$watch('filterText', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            vsscrollbarEvent.filter($scope, newValue);
        }
    });

    // Generate test items (array of strings)
    $scope.allItems = [];
    for (var i = 0; i < 1000002; i++) {
        $scope.allItems.push('Item #' + (i + 1));
    }
});

// Example 2
sampleapp.controller('vsScrollbarCtrl2', function ($scope, vsscrollbarEvent) {

    $scope.visibleItems = [];
    $scope.filterText = '';
    $scope.showObject = 1;

    $scope.topIndex = 0;
    $scope.maxIndex = 0;
    $scope.topPos = 0;
    $scope.maxPos = 0;
    $scope.filteredPageCount = 0;
    $scope.filteredItemCount = 0;

    // Scroll change response data
    $scope.responseData = [];
    $scope.$watchCollection('responseData', function (response) {
        $scope.topIndex = response.topIndex;
        $scope.maxIndex = response.maxIndex;
        $scope.topPos = response.topPos;
        $scope.maxPos = response.maxPos;
        $scope.filteredPageCount = response.filteredPageCount;
        $scope.filteredItemCount = response.filteredItemCount;
        $scope.visibleItems = response.visibleItems;
    });

    // Example function: list item clicked
    $scope.itemClicked = function (index, item) {
        var text = 'Clicked item: \"' + item.name + '\". Its index in the page is: \"' + index + '\" and the total index is: \"' + ($scope.topIndex + index) + '\".';
        $scope.clickedText = text;
    };

    // Filtering
    $scope.$watch('filterText', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            // Filter value from all properties (id, code and name) because item is an object
            vsscrollbarEvent.filter($scope, newValue);
        }
    });

    // Generate test items (array of objects)
    var chars = "ABCDEFGHIJKLMNOPQURSTUVWXYZ";
    $scope.allItems = [];
    for (var i = 0; i < 1000; i++) {
        var rndcode = chars.substr(Math.floor(Math.random() * 27), 1) + chars.substr(Math.floor(Math.random() * 27), 1);
        $scope.allItems.push({id: i, code: rndcode, name: 'Item #' + (i + 1)});
    }
});


