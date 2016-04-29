(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('LocationsController', LocationsController);

    /* ngInject */
    function LocationsController($http, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('locations'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.busy = 0;
        $scope.markers = {};
        $scope.mapCenter = {
            lat: 0,
            lng: 0,
            zoom: 2
        };

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
            if($scope[model] !== '') {
                params[model] = $scope[model];
            } else {
                delete params[model];
            }
        };

        $scope.get_locations = function() {
            var params = {};
            if($scope.country) {
                params.country = $scope.country;
            }
            if($scope.city){
                params.city = $scope.city;
            }

            return dataService.locations(params)
                .then(function(data) {
                    $scope.locations = data.results;
                });
        };

        $scope.get_cities = function() {
            var params = {
                limit: 1000
            };
            if($scope.country){
                params.country = $scope.country;
            }

            return dataService.cities(params)
                .then(function(data) {
                    $scope.cities = data.results;
                });
        };

        $scope.get_countries = function() {
            return dataService.countries()
                .then(function(data) {
                    $scope.countries = data.results;
                });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.markers = {};
            $scope.busy = 1;

            return dataService.locations(params)
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.results.forEach(getMarkers);
                    $scope.total = data.meta.found;
                    $scope.busy = 0;
                });
        };

        $scope.submit = function() {
            $scope.fetch();
        };

        function getMarkers(result, index, ar) {
            if (result.coordinates) {
                $scope.markers[index] = {
                    lat: result.coordinates.latitude,
                    lng: result.coordinates.longitude,
                    message: result.location + ", " + result.city + "<br/>" + result.count + " measurements",
                    draggable: false
                };
            }
        }
    }

})();
