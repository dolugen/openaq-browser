angular.module('OpenQAClient', ['nemLogging', 'ui-leaflet', 'ngRoute'])
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
    .factory('Countries', function() {
        return [
            {
                "name": "ANY",
                "short_code": "",
                "latlng": [0, 0]
            },{
                "name": "Australia",
                "short_code": "AU",
                "latlng": [-27, 133]
            },{
                "name": "Brazil",
                "short_code": "BR",
                "latlng": [-10, -55],
            },{
                "name": "Chile",
                "short_code": "CL",
                "latlng": [-30, -71],
            },{
                "name": "China",
                "short_code": "CN",
                "latlng": [35, 105],
            },{
                "name": "India",
                "short_code": "IN",
                "latlng": [20, 77],
            },{
                "name": "Mongolia",
                "short_code": "MN",
                "latlng": [46, 105],
            },{
                "name": "Netherlands",
                "short_code": "NL",
                "latlng": [52.5, 5.75],
            },{
                "name": "Poland",
                "short_code": "PL",
                "latlng": [52, 20],
            },{
                "name": "Thailand",
                "short_code": "TH",
                "latlng": [15, 100],
            },{
                "name": "United Kingdom",
                "short_code": "GB",
                "latlng": [54, -2],
            },{
                "name": "United States",
                "short_code": "US",
                "latlng": [38, -97],
            }            
        ];
    })
    .controller('LocationCtrl', function($http, $scope, $log, Countries) {
        var API_LOCATIONS = "https://api.openaq.org/v1/locations?limit=1";
        $scope.api_locations_base = API_LOCATIONS;
        $scope.query_url = $scope.api_locations_base;
        $scope.country = "MN";
        $scope.busy = 0;
        $scope.markers = {};
        $scope.countries = Countries;

        function getMarkers(result, index, ar) {
            if (result.coordinates) {
                $scope.markers[index] = {
                    lat: result.coordinates.latitude,
                    lng: result.coordinates.longitude,
                    message: result.location + ", " + result.city + "<br/>" + result.count,
                    draggable: false
                };
            }
        };

        function getCountry(country) {
            return country.short_code === $scope.country;
        };


        $scope.mapCenter = {
            lat: 47.9,
            lng: 106.9,
            zoom: 11
        };
        
        $scope.fetch = function() {
            $scope.markers = {};
            $scope.busy = 1;
            $scope.query_url = $scope.api_locations_base;
            if($scope.country) {
                $scope.query_url += "&country=" + $scope.country;
            }

            var markerc = $scope.countries.filter(getCountry)[0];
            $scope.mapCenter = {
                lat: markerc.latlng[0],
                lng: markerc.latlng[1],
                zoom: 5
            };

            $http.get($scope.query_url).success(function(data) {
                $scope.results = data.results;
                data.results.forEach(getMarkers);

                $scope.found = data.results.length;
                $scope.busy = 0;

                if($scope.found === 0) {
                    $scope.markers[$scope.country] = {
                        lat: markerc.latlng[0],
                        lng: markerc.latlng[1],
                        message: "No data found on <strong>" + markerc.name + "</strong",
                        focus: true
                    };
                    
                }
            });
        };

        $scope.submit = function() {
            $scope.fetch()
        };

    }).
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
                $scope.found = data.results.length;
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
