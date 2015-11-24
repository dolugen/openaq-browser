angular.module('OpenQAClient', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'templates/index.html',
            }).
            when('/locations', {
                templateUrl: 'templates/locations/index.html',
                controller: 'LocationCtrl'
            }).
            when('/measurements', {
                templateUrl: 'templates/measurements/index.html',
                controller: 'MeasurementCtrl'
            }).
            otherwise({
                redirectTo: '/locations'
            });
    }]);
