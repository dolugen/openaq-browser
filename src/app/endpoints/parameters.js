(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('ParametersController', ParametersController);

    /* ngInject */
    function ParametersController($http, $scope, URLService, dataService) {
        var uri = URLService.getUrl('parameters');
        $scope.query_url = uri.toString();
        $scope.busy = 0;

        activate();

        function activate() {
            $scope.busy = 1;

            return dataService.parameters()
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.total = data.results.length;
                    $scope.busy = 0;
                });
        }
    }

})();
