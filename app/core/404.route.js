(function() {
    'use strict';

    angular
        .module('app.core')
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .otherwise({
                templateUrl: 'app/core/404.html'
            });
    }

})();
