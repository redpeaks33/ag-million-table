var main = angular.module("app", [
    "vsscrollbar",
    "ag-million-table"
]);

main.controller('MyController', ['$scope', '$timeout', 'vsscrollbarEvent', 'JSONCreationService', 'WatchCountService',
    function ($scope, $timeout, vsscrollbarEvent, JSONCreationService, WatchCountService) {
        //$scope.initialize = function () {
        //    var startTime = new Date();

        //    //$scope.collection = JSONCreationService.execute();
        //    //$scope.options = {
        //    //    size: 20,
        //    //};

        //    //alert(WatchCountService.getWatchers().length);
        //    //$scope.$on("repeatFinishedEventFired", function () {
        //    //    var endTime = new Date();
        //    //    //alert(endTime - startTime + "ms");
        //    //})
        //}
        $timeout(function () {
            $scope.$broadcast('init-table', JSONCreationService.execute());
        }, 1000);

        $scope.watchConfirm = function () {
            alert(WatchCountService.getWatchers().length);
        }
    }]);