(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('AboutController', AboutController);

    function AboutController($scope, dataService) {
        $scope.fetch = function() {
            dataService.countries()
                .then(function(data) {
                    $scope.countries_count = data.meta.found;
                });
            dataService.locations()
                .then(function(data) {
                    $scope.locations_count = data.meta.found;
                });
            dataService.measurements({ limit: 1})
                .then(function(data) {
                    $scope.measurements_count = data.meta.found;
                });
        };
        
        $scope.fetch();
    }

})();
