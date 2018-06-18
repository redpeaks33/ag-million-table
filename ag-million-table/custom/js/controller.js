var main = angular.module("app", [
    "vsscrollbar",
    "ag-million-table"
]);

main.controller('MyController', ['$scope', '$timeout', 'JSONCreationService', 'WatchCountService',
    function ($scope, $timeout, JSONCreationService, WatchCountService) {
        $timeout(function () {
            $scope.$broadcast('init-table', JSONCreationService.execute());
        }, 1000);

        $scope.watchConfirm = function () {
            alert(WatchCountService.getWatchers().length);
        }
    }]);