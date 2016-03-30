(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('AboutController', AboutController);

    function AboutController($scope, dataService) {
        function isFetchOld(relativeDate) {
            // simple check to see if it's more than an hour old
            return relativeDate.indexOf("hour") > -1 ? true : false;
        }

        $scope.fetch = function() {
            dataService.countries({ limit: 0})
                .then(function(data) {
                    $scope.countries_count = data.meta.found;
                });
            dataService.locations({ limit: 0})
                .then(function(data) {
                    $scope.locations_count = data.meta.found;
                });
            dataService.measurements({ limit: 0})
                .then(function(data) {
                    $scope.measurements_count = data.meta.found.toLocaleString();
                });
            dataService.fetches({ limit: 1 })
            .then(function(data) {
                var relativeDate = moment(data.results[0].timeStarted).fromNow();
                $scope.last_fetch_relative = relativeDate;
                $scope.last_fetch_is_old = isFetchOld(relativeDate);
            });
        };
        
        $scope.fetch();
    }

})();
