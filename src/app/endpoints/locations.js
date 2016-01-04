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
            params[model] = $scope[model];
        };

        $scope.get_countries = function() {
            return dataService.countries()
                .then(function(countries) {
                    $scope.countries = countries;
                });
        };
        $scope.get_countries();
        
        $scope.fetch = function() {
            $scope.markers = {};
            $scope.busy = 1;

            var markerc = $scope.countries.filter(getCountry)[0];

            return dataService.locations(params)
                .then(function(locations) {
                    $scope.results = locations;
                    locations.forEach(getMarkers);

                    $scope.found = locations.length;
                    $scope.busy = 0;

                    if($scope.found === 0) {
                        $scope.markers[$scope.country] = {
                            lat: markerc.latlng[0],
                            lng: markerc.latlng[1],
                            message: "No data found on <strong>" + markerc.name + "</strong",
                            focus: true
                        };
                        
                    }
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
                    message: result.location + ", " + result.city + "<br/>" + result.count,
                    draggable: false
                };
            }
        }

        function getCountry(country) {
            return country.short_code === $scope.country;
        }
    }

})();
