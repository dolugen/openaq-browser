(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('CountriesController', CountriesController);

    /* ngInject */
    function CountriesController($http, $scope, URLService, dataService) {
        var uri = URLService.getUrl('countries');
        var params = {};
        $scope.query_url = uri.toString();

        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
            if($scope[model]) {
                params[model] = $scope[model];
            } else {
                delete params[model];
            }
        };

        activate();

        $scope.submit = function() {
            activate();
        };

        function activate() {
            $scope.busy = 1;

            return dataService.countries()
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.total = data.meta.found;
                    $scope.busy = 0;
                });
        }
    }

})();
