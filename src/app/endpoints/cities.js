(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('CitiesController', CitiesController);

    function CitiesController($http, $log, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('cities'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.busy = 0;
        
        $scope.updateUrl = function(model) {
            params[model] = $scope[model];
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
        };

        $scope.get_countries = function() {
            return dataService.countries()
                .then(function(data) {
                    $scope.countries = data.results;
                });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.busy = 1;

            return dataService.cities(params)
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.found = data.results.length;
                    $scope.busy = 0;
                });
        };

        $scope.submit = function() {
            $scope.fetch();
        };
        
    }

})();
