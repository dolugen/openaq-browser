angular.module('OpenAQClient', ['nemLogging', 'ui-leaflet', 'ngRoute'])
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
            when('/latest', {
                templateUrl: 'templates/latest/index.html',
                controller: 'LatestCtrl'
            }).
            when('/locations', {
                templateUrl: 'templates/locations/index.html',
                controller: 'LocationCtrl'
            }).
            when('/measurements', {
                templateUrl: 'templates/measurements/index.html',
                controller: 'MeasurementCtrl'
            }).
            when('/graph', {
                templateUrl: 'templates/graph.html',
                controller: 'GraphCtrl'
            }).
            otherwise({
                redirectTo: '/measurements'
            });
    }])
    .controller('NavCtrl', ['$rootScope', '$location', function($rootScope, $location){
        $rootScope.urlLocation = $location;
    }])
    .service('URLService', function() {

        this.getOpenAQUrl = function(name) {
            var API_ROOT = "https://api.openaq.org/v1/";
            var availablePoints = ['cities', 'countries', 'latest', 'locations', 'measurements'];
            if (availablePoints.indexOf(name) < 0) { throw 'API endpoint unavailable.'; };
            return API_ROOT + name;
        };

        this.updateUrl = function(uri, key, value) {
            if (uri.hasQuery(key)) {
                uri.removeQuery(key);
            };
            if (value) {
                uri.addSearch(key, value);
            };

            return uri.toString();
        };
    })
    .directive('formQueryUrl', function() {
        return {
            'templateUrl': 'templates/form-elements/query-url.html'
        }
    })
    .controller('LatestCtrl', function($http, $log, $scope, URLService) {
        var uri = URI(URLService.getOpenAQUrl('latest'));
        $scope.query_url = uri.toString();
        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
        };

        $scope.get_locations = function() {
            var uri = URI(URLService.getOpenAQUrl('locations'));
            uri.addQuery('country', $scope.country);
            if($scope.city){
                uri.addQuery('city', $scope.city);
            };
            
            $http.get(uri)
                .success(function(data){
                    $scope.locations = data.results;
                });
        };

        $scope.get_cities = function() {
            var uri = URI(URLService.getOpenAQUrl('cities'));
            uri.addQuery('country', $scope.country);

            $http.get(uri)
                .success(function(data){
                    $scope.cities = data.results;
            });
        };

        $scope.get_countries = function() {
            var uri = URI(URLService.getOpenAQUrl('countries'));

            $http.get(uri)
                .success(function(data){
                    $scope.countries = data.results;
                });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.busy = 1;

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
    directive('latestTable', function() {
        return {
            'restrict': 'E',
            'templateUrl': 'templates/latest/table.html',
       };
    }).
    directive('latestForm', function() {
       return {
           'restrict': 'E',
           'templateUrl': 'templates/latest/form.html'
       };
    }).
    controller('LocationCtrl', function($http, $scope, $log, URLService) {
        var uri = URI(URLService.getOpenAQUrl('locations'));
        $scope.query_url = uri.toString();
        $scope.busy = 0;
        $scope.markers = {};

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
        };

        $scope.get_countries = function() {
            var uri = URI(URLService.getOpenAQUrl('countries'));
            $http.get(uri)
                .success(function(data){
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
       };
    }).
    directive('locationsForm', function() {
       return {
           'restrict': 'E',
           'templateUrl': 'templates/locations/form.html',

       };
    }).
    controller('MeasurementCtrl', function($http, $scope, $log, URLService) {
        var uri = URI(URLService.getOpenAQUrl('measurements'));
        $scope.query_url = uri.toString();
        $scope.limit = 10;
        $scope.page = 1;
        $scope.order_by = "date";
        $scope.sort = "desc"
        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
        };

        var setDefaults = function(uri) {
            var defaultFields = [
                'limit',
                'page',
                'order_by',
                'sort'
            ]

            for (var i in defaultFields) {
                $scope.updateUrl(defaultFields[i]);
            }
        };
        setDefaults();
        
        $scope.get_locations = function() {
            var uri = URI(URLService.getOpenAQUrl('locations'));
            if($scope.country) {
                uri.addQuery("country", $scope.country);
            }
            if($scope.city){
                uri.addQuery("city", $scope.city);
            };
            
            $http.get(uri.toString())
                .success(function(data){
                    $scope.locations = data.results;
                });
        };

        $scope.get_cities = function() {
            var uri = URI(URLService.getOpenAQUrl('cities'));
            if($scope.country){
                uri.addQuery('country', $scope.country);
            }
            $http.get(uri.toString())
                .success(function(data){
                    $scope.cities = data.results;
            });
        };

        $scope.get_countries = function() {
            var uri = URI(URLService.getOpenAQUrl('countries'));
            $http.get(uri.toString())
                .success(function(data){
                    $scope.countries = data.results;
            });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.busy = 1;

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
       };
    }).
    directive('measurementsForm', function() {
       return {
           'restrict': 'E',
           'templateUrl': 'templates/measurements/form.html',

       };
    }).
    controller('CityCtrl', function($http, $scope, URLService) {
        var uri = URI(URLService.getOpenAQUrl('cities'));
        $scope.query_url = uri.toString();
        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
        };

        $scope.get_countries = function() {
            var uri = URI(URLService.getOpenAQUrl('countries'));
            $http.get(uri.toString()).success(function(data){
                $scope.countries = data.results;
            });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.busy = 1;

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
       };
    }).
    directive('citiesForm', function() {
       return {
           'restrict': 'E',
           'templateUrl': 'templates/locations/form.html',
       };
    }).
    controller('CountryCtrl', function($http, $scope, URLService) {
        $scope.query_url = URLService.getOpenAQUrl('countries');
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
       };
    }).
    controller('GraphCtrl', function($scope, $http, $log, URLService) {
        var _d = new Date(); 
        _d.setDate(_d.getDate() - 1);
        var yesterday = _d.toISOString().slice(0, 10)
        var _d = new Date();
        _d.setDate(_d.getDate() - 7);
        week_ago = _d.toISOString().slice(0, 10);

        $scope.date_from_filters = [
            {
                'text': 'Past week',
                'value': week_ago
            },{
                'text': 'Past day',
                'value': yesterday
            }
        ];
        $scope.date_from = week_ago;

        var initial_locations = [
            {
                'country': 'MN',
                'city': 'Ulaanbaatar',
                'location': 'Tolgoit'                
            },
            {
                'country': 'IN',
                'city': 'Delhi',
                'location': 'Punjabi Bagh'                
            },
            {
                'country': 'CN',
                'city': 'Beijing',
                'location': 'Beijing US Embassy'                
            },
        ];

        var graph_defaults = {
            parameter: 'pm25',
            date_from: week_ago,
            limit: 1000
        };

        var generateChart = function(data) {
            $scope.chart = c3.generate({
                    size: {
                        height: 600
                    },
                    data: {
                        xs: function() {
                            var xs = {};
                            data.forEach(function(d) {
                                xs[d.name] = 'ID' + d.name;
                            });
                            return xs;
                        }(),
                        columns: function() {
                            var columns = [];
                            data.forEach(function(d) {
                                columns.push(_(['ID' + d.name]).concat(_.map(d.data, function(n) { return new Date(_.get(n, 'date.local')) })).value());
                                columns.push(_([d.name]).concat(_.map(d.data, function(n) { return new Date(_.get(n, 'value')) })).value());
                            });
                            return columns;
                        }(),
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            label: 'Local Time',
                            tick: {
                                format: '%a %d', // %a %d %H:%M %p (use different formats for day and week graphs)
                                count: 12
                            },
                            localtime: true
                        },
                        y: {
                            label: {
                                text: 'PM 2.5 (µg/m³)',
                            }
                        }
                    },
                    legend: {
                        position: 'inset',
                        inset: {
                            anchor: 'top-right'
                        }
                    },
                    point: {
                        show: false
                    },
                    tooltip: {
                        format: {
                            title: function(x) { return x }
                        }
                    }
                }); // end of c3.generate
        }

        var updateGraph = function(data) {
            $scope.chart.load({
                columns: function() {
                    var columns = [];
                    data.forEach(function(d) {
                        columns.push(_(['ID' + d.name]).concat(_.map(d.data, function(n) { return new Date(_.get(n, 'date.local')) })).value());
                        columns.push(_([d.name]).concat(_.map(d.data, function(n) { return new Date(_.get(n, 'value')) })).value());
                    });
                    return columns;
                }()
            });
        };

        var getDataAndGraph = function(locations, data) {
            if (locations.length > 0) {
                var location = locations.pop();
                var uri = URI(URLService.getOpenAQUrl('measurements'));
                uri.addSearch('country', location.country);
                uri.addSearch('city', location.city);
                uri.addSearch('location', location.location);
                uri.addSearch('parameter', graph_defaults.parameter);
                uri.addSearch('date_from', graph_defaults.date_from);
                uri.addSearch('limit', graph_defaults.limit);

                $http.get(uri.toString())
                    .success(function(response) {
                        data.push({
                            'id': location.country + '-' + location.location,
                            'name': location.location + ', ' + location.city,
                            'data': response.results
                        });
                        getDataAndGraph(locations, data);
                    });
            } else {
                if(!$scope.chart) {
                    generateChart(data);
                } else {
                    $scope.chart.unload();
                    updateGraph(data);
                }
            };
        };  // end of getDataAndDraw

        $scope.updateGraph = function() {
            graph_defaults.date_from = $scope.date_from;
            getDataAndGraph(_.clone(initial_locations), new Array());
        };

        getDataAndGraph(_.clone(initial_locations), new Array());
    });
