(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('MeasurementsController', MeasurementsController);

    function MeasurementsController($http, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('measurements'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.limit = 100;
        $scope.page = 1;
        $scope.order_by = "date";
        $scope.sort = "desc";
        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
            if($scope[model]) {
                params[model] = $scope[model];
            } else {
                delete params[model];
            }
        };

        var setDefaults = function(uri) {
            var defaultFields = [
                'limit',
                'page',
                'order_by',
                'sort'
            ];

            for (var i in defaultFields) {
                $scope.updateUrl(defaultFields[i]);
            }
        };
        setDefaults();

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
            var params = {};
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
            $scope.busy = 1;

            return dataService.measurements(params)
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.total = data.meta.found;
                    $scope.limit = data.meta.limit;
                    $scope.busy = 0;
                });
        };

        $scope.submit = function() {
            $scope.fetch();
        };

    }
})();
