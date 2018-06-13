var main = angular.module("app", [
    "vsscrollbar",
    "ag-million-table"
]);

main.controller('MyController', ['$scope', 'vsscrollbarEvent', 'JSONCreationService', 'WatchCountService',
    function ($scope, vsscrollbarEvent, JSONCreationService, WatchCountService) {
        $scope.initialize = function () {
            var startTime = new Date();

            //$scope.collection = JSONCreationService.execute();
            $scope.options = {
                size: 20,
            };

            //alert(WatchCountService.getWatchers().length);
            //$scope.$on("repeatFinishedEventFired", function () {
            //    var endTime = new Date();
            //    //alert(endTime - startTime + "ms");
            //})
        }

        $scope.watchConfirm = function () {
            alert(WatchCountService.getWatchers().length);
        }
    }]);