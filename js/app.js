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
        $rootScope.urlLocation = $location;
    }])
    .factory('openaq_api_url', function() {
        var API_ROOT = "https://api.openaq.org/v1/";
        var availablePoints = ['cities', 'countries', 'latest', 'locations', 'measurements'];
        return function(name){
            if (availablePoints.indexOf(name) < 0) { throw 'API endpoint unavailable.'; };
            return API_ROOT + name;
        };
    })
    .controller('LocationCtrl', function($http, $scope, $log, openaq_api_url) {
        $scope.base_url = openaq_api_url('locations');
        $scope.query_url = $scope.base_url;
        $scope.busy = 0;
        $scope.markers = {};

        $scope.get_countries = function() {
            $http.get(openaq_api_url('countries')).success(function(data){
                $scope.countries = data.results;
            });
        };
        $scope.get_countries();

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
            lat: 0,
            lng: 0,
            zoom: 2
        };
        
        $scope.fetch = function() {
            $scope.markers = {};
            $scope.busy = 1;
            $scope.query_url = $scope.base_url;
            if($scope.country) {
                $scope.query_url += "?country=" + $scope.country;
            }

            var markerc = $scope.countries.filter(getCountry)[0];

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
        $scope.page = 1;
        
        $scope.busy = 0;

        $scope.get_locations = function() {
            var url = openaq_api_url('locations') + "?country=" + $scope.country;
            if($scope.city){
                url += "&city=" + $scope.city;
            };
            
            $http.get(url)
                .success(function(data){
                    $scope.locations = data.results;
                });
        };

        $scope.get_cities = function() {
            $http.get(openaq_api_url('cities') + "?country=" + $scope.country)
                .success(function(data){
                    $scope.cities = data.results;
                    $scope.get_locations()
            });
        };

        $scope.get_countries = function() {
            $http.get(openaq_api_url('countries')).success(function(data){
                $scope.countries = data.results;
                $scope.get_cities();
            });
        };
        $scope.get_countries();

        var set_url = function() {
            $scope.query_url = $scope.base_url
                + "?limit=" + $scope.limit
                + "&page=" + $scope.page;
            if($scope.country) {
                $scope.query_url += "&country=" + $scope.country;
            }
            if($scope.city) {
                $scope.query_url += "&city=" + $scope.city;
            }
            if($scope.location) {
                $scope.query_url += "&location=" + $scope.location;
            }
            if($scope.parameter) {
                $scope.query_url += "&parameter=" + $scope.parameter;
            }
            if($scope.date_from) {
                $scope.query_url += "&date_from=" + $scope.date_from;
            }
            if($scope.date_to) {
                $scope.query_url += "&date_to=" + $scope.date_to;
            }            
        };
               
        $scope.fetch = function() {
            $scope.busy = 1;

            set_url();

            $http.get($scope.query_url).success(function(data) {
                $scope.results = data.results;
                $scope.found = data.meta.found;
                $scope.limit = data.meta.limit;

                $scope.busy = 0;
            });
        };

        $scope.submit = function() {
            $scope.fetch()
        };

        $scope.get_csv = function() {
            $scope.busy = 1;

            set_url();
            $scope.query_url += "&format=csv";

            $http.get($scope.query_url).success(function(data) {
                // http://stackoverflow.com/a/31871521
                var anchor = angular.element('<a/>');
                anchor.css({display: 'none'}); // Make sure it's not visible
                angular.element(document.body).append(anchor); // Attach to document

                anchor.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                    target: '_blank',
                    download: 'filename.csv'
                })[0].click();

                anchor.remove(); // Clean it up afterwards
                $scope.busy = 0;
            });
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
    controller('CityCtrl', function($http, $scope, openaq_api_url) {
        $scope.base_url = openaq_api_url('cities');
        $scope.query_url = $scope.base_url;
        $scope.busy = 0;
        $scope.country = 'MN';

        $scope.get_countries = function() {
            $http.get(openaq_api_url('countries')).success(function(data){
                $scope.countries = data.results;
            });
        };
        $scope.get_countries();

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
