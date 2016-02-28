(function() {
    'use strict';

    angular
        .module('app.core')
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/core/about.html',
                controller: 'AboutController'
            });
    }

})();
