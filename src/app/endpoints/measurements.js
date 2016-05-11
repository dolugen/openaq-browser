(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('MeasurementsController', MeasurementsController);

    function MeasurementsController($http, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('measurements'));
        var params = {};
        $scope.query_url = uri.toString();
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

        function get_include_fields(model){
            var include_fields = [];
            for(var i = 0; i < Object.keys(model).length; i++){
                if(model[Object.keys(model)[i]] === true){
                    include_fields.push(Object.keys(model)[i]);
                }
            }
            return include_fields;
        }

        $scope.updateIncludeFields = function() {
            // a special case for include_fields
            var model = 'include_fields';
            var include_fields = get_include_fields($scope.include_fields).join();
            $scope.query_url = URLService.updateUrl(uri, model, include_fields);
            if($scope[model]) {
                params[model] = include_fields;
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
