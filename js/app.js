angular.module('OpenQAClient', ['nemLogging', 'ui-leaflet', 'ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'templates/index.html',
            }).
            when('/cities', {
                templateUrl: 'templates/cities/index.html',
                controller: 'CityCtrl'
            }).
            when('/countries', {
                templateUrl: 'templates/countries/index.html',
                controller: 'CountryCtrl'
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
    .factory('openaq_api_url', function() {
        var API_ROOT = "https://api.openaq.org/v1/";
        var availablePoints = ['cities', 'countries', 'latest', 'locations', 'measurements'];
        return function(name){
            if (availablePoints.indexOf(name) < 0) { throw 'API endpoint unavailable.'; };
            return API_ROOT + name;
        };
    })
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
    .controller('LocationCtrl', function($http, $scope, $log, Countries, openaq_api_url) {
        $scope.base_url = openaq_api_url('locations');
        $scope.query_url = $scope.base_url;
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
            $scope.query_url = $scope.base_url;
            if($scope.country) {
                $scope.query_url += "?country=" + $scope.country;
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
    controller('MeasurementCtrl', function($http, $scope, $log, openaq_api_url) {
        $scope.base_url = openaq_api_url('measurements');
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
    }).
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
    }).
    controller('CityCtrl', function($http, $scope, Countries, openaq_api_url) {
        $scope.base_url = openaq_api_url('cities');
        $scope.query_url = $scope.base_url;
        $scope.busy = 0;
        $scope.country = 'MN';
        $scope.countries = Countries;

        $scope.fetch = function() {
            $scope.busy = 1;
            if($scope.country) {
                $scope.query_url = $scope.base_url + "?country=" + $scope.country;
            }

            $http.get($scope.query_url).success(function(data) {
                $scope.results = data.results;
                $scope.found = data.results.length;
                $scope.busy = 0;
            });
        };

        $scope.submit = function() {
            $scope.fetch()
        };

    }).
    directive('citiesTable', function() {
        return {
            'restrict': 'E',
            'templateUrl': 'templates/cities/table.html',
            'controller': 'CityCtrl'
       };
    }).
    directive('citiesForm', function() {
       return {
           'restrict': 'E',
           'templateUrl': 'templates/locations/form.html',
       };
    }).
    controller('CountryCtrl', function($http, $scope, openaq_api_url) {
        $scope.base_url = openaq_api_url('countries');
        $scope.query_url = $scope.base_url;
        $scope.busy = 0;

        $scope.fetch = function() {
            $scope.busy = 1;

            $http.get($scope.query_url).success(function(data) {
                $scope.results = data.results;
                $scope.found = data.results.length;
                $scope.busy = 0;
            });
        };

        $scope.fetch();

        $scope.submit = function() {
            $scope.fetch()
        };

    }).
    directive('countriesTable', function() {
        return {
            'restrict': 'E',
            'templateUrl': 'templates/countries/table.html',
            'controller': 'CountryCtrl'
       };
    });
