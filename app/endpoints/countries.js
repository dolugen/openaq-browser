(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('CountriesController', CountriesController);

    /* ngInject */
    function CountriesController($http, $scope, URLService, dataService) {
        $scope.query_url = URLService.getUrl('countries');
        $scope.busy = 0;
        
        activate();

        $scope.submit = function() {
            activate();
        };

        function activate() {
            $scope.busy = 1;

            return dataService.countries()
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.found = data.results.length;
                    $scope.busy = 0;
                });
        }
    }

})();

