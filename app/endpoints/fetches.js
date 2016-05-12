(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('FetchesController', FetchesController);

    function FetchesController($http, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('fetches'));
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

        $scope.fetch = function() {
            $scope.busy = 1;

            return dataService.fetches(params)
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
