(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/cities', {
                templateUrl: 'app/endpoints/cities.html',
                controller: 'CitiesController'
            })
            .when('/countries', {
                templateUrl: 'app/endpoints/countries.html',
                controller: 'CountriesController'
            })
            .when('/fetches', {
                templateUrl: 'app/endpoints/fetches.html',
                controller: 'FetchesController',
            })
            .when('/latest', {
                templateUrl: 'app/endpoints/latest.html',
                controller: 'LatestController'
            })
            .when('/locations', {
                templateUrl: 'app/endpoints/locations.html',
                controller: 'LocationsController'
            })
            .when('/measurements', {
                templateUrl: 'app/endpoints/measurements.html',
                controller: 'MeasurementsController'
            })
            .when('/parameters', {
                templateUrl: 'app/endpoints/parameters.html',
                controller: 'ParametersController'
            })
            .when('/sources', {
                templateUrl: 'app/endpoints/sources.html',
                controller: 'SourcesController'
            });
    }

})();
