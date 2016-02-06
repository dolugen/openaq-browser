(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('LatestController', LatestController);

    /* ngInject */
    function LatestController($http, $scope, URLService, dataService, errors) {
        var uri = URI(URLService.getUrl('latest'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
            params[model] = $scope[model];
        };

        $scope.get_locations = function() {
            var params = { 
                country: $scope.country
            };
            if($scope.city){
                params.city = $scope.city;
            }
            
            return dataService.locations(params)
                .then(function(data) {
                    $scope.locations = data.results;
                });
        };

        $scope.get_cities = function() {
            return dataService.cities({ country: $scope.country })
                .then(function(data) {
                    $scope.cities = data.results;
                });
        };

        $scope.get_countries = function() {
            return dataService.countries()
                .then(function(data) {
                    delete params.city;
                    $scope.countries = data.results;
                });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.busy = 1;

            return dataService.latest(params)
                .then(function(data) {
                    $scope.results = data.results;                    
                    $scope.found = data.results.length;
                    $scope.busy = 0;
                })
                .catch(function(message) {
                    errors.catch();
                    $scope.busy = 0;
                });
        };

        $scope.submit = function() {
            $scope.fetch();
        };
    }
})();

