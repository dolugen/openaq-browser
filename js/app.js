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
    }])
    .controller('NavCtrl', ['$rootScope', '$location', '$log', function($rootScope, $location, $log){
        $rootScope.location = $location;
    }])
    .controller('LocationCtrl', ['$http', '$scope', '$log', function($http, $scope, $log) {
        var API_LOCATIONS = "https://api.openaq.org/v1/locations?limit=1";
        $scope.api_locations_base = API_LOCATIONS;
        $scope.query_url = $scope.api_locations_base;
        $scope.country = "MN";
        $scope.busy = 0;
        
        $scope.fetch = function() {
            $scope.busy = 1;
            $scope.query_url = $scope.api_locations_base;
            if($scope.country) {
                $scope.query_url += "&country=" + $scope.country;
            }

            $http.get($scope.query_url).success(function(data) {
                $scope.results = data.results;
                $scope.found = data.meta.found;
                $scope.busy = 0
            });
        }

        $scope.submit = function() {
            $scope.fetch()
        };
    }]).
    directive('locationsTable', function() {
        return {
            'restrict': 'E',
            'templateUrl': 'templates/locations/table.html',
            'controller': 'LocationCtrl'
       };
    }).
    directive('locationsForm', function() {
       return {
           'restrict': 'E',
           'templateUrl': 'templates/locations/form.html',

       };
    }).
    controller('MeasurementCtrl', ['$http', '$scope', '$log', function($http, $scope, $log) {
        var API_MEASUREMENTS = "https://api.openaq.org/v1/measurements";
        $scope.base_url = API_MEASUREMENTS;
        $scope.query_url = $scope.base_url;
        $scope.country = "MN";
        $scope.limit = 10;
        $scope.busy = 0;

        $scope.fetch = function() {
            $scope.busy = 1;
            $scope.query_url = $scope.base_url + "?limit=" + $scope.limit;
            if($scope.country) {
                $scope.query_url += "&country=" + $scope.country;
            }
            if($scope.parameter) {
                $scope.query_url += "&parameter=" + $scope.parameter;
            }

            $http.get($scope.query_url).success(function(data) {
                $scope.results = data.results;
                $scope.found = data.meta.found;
                $scope.limit = data.meta.limit;
                $scope.busy = 0;
            });
        }

        $scope.submit = function() {
            $scope.fetch()
        };
    }]).
    directive('measurementsTable', function() {
        return {
            'restrict': 'E',
            'templateUrl': 'templates/measurements/table.html',
            'controller': 'MeasurementCtrl'
       };
    }).
    directive('measurementsForm', function() {
       return {
           'restrict': 'E',
           'templateUrl': 'templates/measurements/form.html',

       };
    });
