(function() {
    'use strict';

    angular
        .module('app.graph')
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/graph', {
                templateUrl: 'app/graph/graph.html',
                controller: 'GraphController'
            });
    }

})();
