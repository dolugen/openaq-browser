(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('MeasurementsController', MeasurementsController);

    function MeasurementsController($http, $scope, $filter, URLService, dataService) {
        var uri = URI(URLService.getUrl('measurements'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.order_by = "date";
        $scope.sort = "desc";
        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            var urlValue = $scope[model];
            if(model === "include_fields"){
                urlValue = formatIncludeFields();
            }
            if(["date_from", "date_to"].indexOf(model) > -1){
                urlValue = formatDateField(model);
            }
            $scope.query_url = URLService.updateUrl(uri, model, urlValue);
            if($scope[model]) {
                params[model] = urlValue;
            } else {
                delete params[model];
            }
        };

        function getIncludeFields() {
            var model = $scope.include_fields;
            var include_fields = [];
            for(var i = 0; i < Object.keys(model).length; i++){
                if(model[Object.keys(model)[i]] === true){
                    include_fields.push(Object.keys(model)[i]);
                }
            }
            return include_fields;
        }

        function formatIncludeFields() {
            return getIncludeFields().join();
        }

        function formatDateField(model) {
            return $filter('date')($scope[model], "yyyy-MM-dd");
        }

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
