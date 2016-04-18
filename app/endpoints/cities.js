(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('CitiesController', CitiesController);

    function CitiesController($http, $log, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('cities'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.limit = 100;
        $scope.page = 1;
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
                'page'
            ];

            for (var i in defaultFields) {
                $scope.updateUrl(defaultFields[i]);
            }
        };
        setDefaults();

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
                    $scope.total = data.meta.found;
                    $scope.busy = 0;
                });
        };

        $scope.submit = function() {
            $scope.fetch();
        };

    }

})();
