 (function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('SourcesController', SourcesController);

    function SourcesController($http, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('sources'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.busy = 0;

        $scope.fetch = function() {
            $scope.busy = 1;

            return dataService.sources(params)
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.total = data.meta.found;
                    $scope.busy = 0;
                });
        };

        $scope.fetch();

    }

})();
