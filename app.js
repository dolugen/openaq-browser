(function() {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.endpoints',
        'app.graph'
    ]);

})();

(function() {
    angular
        .module('app.core', [
            'ngRoute'
        ]);
})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .config(config);

    function config($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('constant', {
            API_HOST: "https://api.openaq.org/v1/"
        })
        .constant('ENDPOINTS', [
            'cities',
            'countries',
            'latest',
            'locations',
            'measurements'
        ]);

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .factory("errors", function($rootScope){
            return {
                catch: function(message){
                    message = message || "Failed to get data. Try again in a few minutes.";
                    $rootScope.message = message;
                }
            };
        });

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('formQueryUrl', formQueryUrl);

    function formQueryUrl() {
        return {
            'templateUrl': 'app/core/query-url.html'
        };
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .service('URLService', URLService);

    function URLService(constant) {
        this.getUrl = function(name) {
            if (name === undefined) { throw new Error('API endpoint required.'); }
            var apiRoot = constant.API_HOST;
            var availablePoints = ['cities', 'countries', 'latest', 'locations', 'measurements'];
            if (availablePoints.indexOf(name) < 0) { throw new Error('API endpoint unavailable.'); }
            return apiRoot + name;
        };

        this.updateUrl = function(uri, key, value) {
            if (uri.hasQuery(key)) {
                uri.removeQuery(key);
            }
            if (value) {
                uri.addSearch(key, value);
            }

            return uri.toString();
        };
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .service('dataService', dataService);

    function dataService($q, $http, $log, constant, ENDPOINTS) {
        var apiRoot = constant.API_HOST;

        var service = {
            locations: locations,
            latest: latest,
            measurements: measurements,
            cities: cities,
            countries: countries
        };

        return service;

        function get(name, params) {
            params = params ? '?' + $.param(params) : '';
            return $http.get(apiRoot + name + params, { timeout: 10*1000 })
                .then(function(result) {
                    return $q.when(result.data);
                })
                .catch(function(message) {
                    $log.log('Failed to get data');
                    return $q.reject(message.data);
                });
        }

        function locations(params) {
            return get('locations', params);
        }

        function latest(params) {
            return get('latest', params);
        }

        function measurements(params) {
            return get('measurements', params);
        }

        function cities(params) {
            return get('cities', params);
        }

        function countries(params) {
            return get('countries', params);
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .service('storageService', storageService);

    function storageService() {
        var service = {
            get: get,
            set: set,
            remove: remove
        };
        return service;

        function get(key) {
            return JSON.parse(localStorage.getItem(key));
        }

        function set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }

        function remove(key) {
            localStorage.removeItem(key);
        }

    }
})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .service('dateFactory', dateFactory);

    function dateFactory() {
        function yesterday() {
            var _d = new Date(); 
            _d.setDate(_d.getDate() - 1);
            return _d.toISOString().slice(0, 10);
        }

        function weekAgo() {
            var _d = new Date();
            _d.setDate(_d.getDate() - 7);
            return _d.toISOString().slice(0, 10);
        }

        return {
            yesterday: yesterday,
            weekAgo: weekAgo
        };
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('NavController', NavController);

    function NavController($rootScope, $location) {
        $rootScope.urlLocation = $location;
    }

})();

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

(function() {
    'use strict';

    angular
        .module('app.core')
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/core/about.html'
            });
    }

})();

(function() {
    'use strict';

    angular.module('app.endpoints', [
        'app.core',
        'ngRoute',
        'ui-leaflet',
        'nemLogging'
    ]);
})();

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
            });
    }

})();

(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('CitiesController', CitiesController);

    function CitiesController($http, $log, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('cities'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.busy = 0;
        
        $scope.updateUrl = function(model) {
            params[model] = $scope[model];
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
        };

        $scope.get_countries = function() {
            return dataService.countries()
                .then(function(data) {
                    $scope.countries = data.results;
                });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.busy = 1;

            return dataService.cities(params)
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.found = data.results.length;
                    $scope.busy = 0;
                });
        };

        $scope.submit = function() {
            $scope.fetch();
        };
        
    }

})();

(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('citiesTable', citiesTable);

    function citiesTable() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/cities-table.html',
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('citiesForm', citiesForm);

    function citiesForm() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/locations-form.html',
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('CountriesController', CountriesController);

    /* ngInject */
    function CountriesController($http, $scope, URLService, dataService) {
        $scope.query_url = URLService.getUrl('countries');
        $scope.busy = 0;
        
        activate();

        $scope.submit = function() {
            activate();
        };

        function activate() {
            $scope.busy = 1;

            return dataService.countries()
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.found = data.results.length;
                    $scope.busy = 0;
                });
        }
    }

})();


(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('countriesTable', countriesTable);

    function countriesTable() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/countries-table.html',
        };
    }

})();


(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('LatestController', LatestController);

    /* ngInject */
    function LatestController($http, $scope, URLService, dataService, errors) {
        var uri = URI(URLService.getUrl('latest'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
            params[model] = $scope[model];
        };

        $scope.get_locations = function() {
            var params = { 
                country: $scope.country
            };
            if($scope.city){
                params.city = $scope.city;
            }
            
            return dataService.locations(params)
                .then(function(data) {
                    $scope.locations = data.results;
                });
        };

        $scope.get_cities = function() {
            return dataService.cities({ country: $scope.country })
                .then(function(data) {
                    $scope.cities = data.results;
                });
        };

        $scope.get_countries = function() {
            return dataService.countries()
                .then(function(data) {
                    params.city = null;
                    $scope.countries = data.results;
                });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.busy = 1;

            return dataService.latest(params)
                .then(function(data) {
                    $scope.results = data.results;                    
                    $scope.found = data.results.length;
                    $scope.busy = 0;
                })
                .catch(function(message) {
                    errors.catch();
                    $scope.busy = 0;
                });
        };

        $scope.submit = function() {
            $scope.fetch();
        };
    }
})();


(function() {
    angular
        .module('app.endpoints')
        .directive('latestTable', function() {
            return {
                'restrict': 'E',
                'templateUrl': 'app/endpoints/latest-table.html',
            };
        });
})();

(function() {
    angular
        .module('app.endpoints')
        .directive('latestForm', function() {
            return {
                'restrict': 'E',
                'templateUrl': 'app/endpoints/latest-form.html',
            };
        });
})();

(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('LocationsController', LocationsController);

    /* ngInject */
    function LocationsController($http, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('locations'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.busy = 0;
        $scope.markers = {};
        $scope.mapCenter = {
            lat: 0,
            lng: 0,
            zoom: 2
        };

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
            params[model] = $scope[model];
        };

        $scope.get_countries = function() {
            return dataService.countries()
                .then(function(data) {
                    $scope.countries = data.results;
                });
        };
        $scope.get_countries();
        
        $scope.fetch = function() {
            $scope.markers = {};
            $scope.busy = 1;

            var markerc = $scope.countries.filter(getCountry)[0];

            return dataService.locations(params)
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.results.forEach(getMarkers);

                    $scope.found = $scope.results.length;
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
            $scope.fetch();
        };

        function getMarkers(result, index, ar) {
            if (result.coordinates) {
                $scope.markers[index] = {
                    lat: result.coordinates.latitude,
                    lng: result.coordinates.longitude,
                    message: result.location + ", " + result.city + "<br/>" + result.count,
                    draggable: false
                };
            }
        }

        function getCountry(country) {
            return country.short_code === $scope.country;
        }
    }

})();

(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('locationsTable', locationsTable);

    function locationsTable() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/locations-table.html',
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('locationsForm', locationsForm);

    function locationsForm() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/locations-form.html',
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .controller('MeasurementsController', MeasurementsController);

    function MeasurementsController($http, $scope, URLService, dataService) {
        var uri = URI(URLService.getUrl('measurements'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.limit = 10;
        $scope.page = 1;
        $scope.order_by = "date";
        $scope.sort = "desc";
        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
            params[model] = $scope[model];
        };

        var setDefaults = function(uri) {
            var defaultFields = [
                'limit',
                'page',
                'order_by',
                'sort'
            ];

            for (var i in defaultFields) {
                $scope.updateUrl(defaultFields[i]);
            }
        };
        setDefaults();
        
        $scope.get_locations = function() {
            var params = {};
            if($scope.country) {
                params.country = $scope.country;
            }
            if($scope.city){
                params.city = $scope.city;
            }

            return dataService.locations(params)
                .then(function(data) {
                    $scope.locations = data.results;
                });
        };

        $scope.get_cities = function() {
            var params = {};
            if($scope.country){
                params.country = $scope.country;
            }

            return dataService.cities(params)
                .then(function(data) {
                    $scope.cities = data.results;
                });
        };

        $scope.get_countries = function() {
            return dataService.countries()
                .then(function(data) {
                    $scope.countries = data.results;
                });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.busy = 1;

            return dataService.measurements()
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.found = data.meta.found;
                    $scope.limit = data.meta.limit;
                    $scope.busy = 0;
                });
        };

        $scope.submit = function() {
            $scope.fetch();
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
    }
})();

(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('measurementsForm', measurementsForm);

    function measurementsForm() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/measurements-form.html',
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('measurementsTable', measurementsTable);

    function measurementsTable() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/measurements-table.html',
        };
    }
})();

(function() {
    'use strict';

    angular.module('app.graph', [
        'ngRoute',
        'angucomplete-alt'
    ]);
})();

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

(function() {
    'use strict';

    angular
        .module('app.graph')
        .controller('GraphController', GraphController);

    function GraphController($scope, $http, $log, URLService, dateFactory, storageService) {
        var weekAgo = dateFactory.weekAgo();

        $scope.date_from_filters = [
            {
                'text': 'Past week',
                'value': weekAgo
            },{
                'text': 'Past day',
                'value': dateFactory.yesterday()
            }
        ];
        $scope.date_from = weekAgo;

        var initial_locations = [
            {
                'country': 'MN',
                'city': 'Ulaanbaatar',
                'location': 'Tolgoit'                
            },
            {
                'country': 'GB',
                'city': 'London',
                'location': 'Camden Kerbside'                
            },
            {
                'country': 'CN',
                'city': 'Beijing',
                'location': 'Beijing US Embassy'                
            },
        ];

        var _selectedLocations = "OpenAQ.graph.selectedLocations";
        var _locationsList = "OpenAQ.graph.locationsList";

        $scope.selectedLocations = storageService.get(_selectedLocations) || _.clone(initial_locations);

        var graph_defaults = {
            parameter: 'pm25',
            date_from: weekAgo,
            limit: 1000
        };
        $scope.parameter = graph_defaults.parameter;

        // get all locations for search
        var fetchLocations = function() {
            var uri = URI(URLService.getUrl('locations'));
            uri.addSearch('parameter', graph_defaults.parameter);
            $http.get(uri.toString())
                .success(function(response) {
                    $scope.locationsList = _.map(response.results, function(result) {
                        // for autocomplete description only
                        result.city_country = result.city + ', ' + result.country;
                        return result;
                    });
                    storageService.set(_locationsList, $scope.locationsList);
                });
        };
        $scope.locationsList = storageService.get(_locationsList) || fetchLocations();
        
        $scope.selectedObject = function(location) {
            if($scope.selectedLocations.indexOf(location.originalObject) < 0) {
                $scope.selectedLocations.push(location.originalObject);
                storageService.set(_selectedLocations, $scope.selectedLocations);
            }
        };

        $scope.removeLocation = function(location) {
            $scope.selectedLocations = _.pull($scope.selectedLocations, location);
            storageService.set(_selectedLocations, $scope.selectedLocations);
        };

        $scope.resetLocations = function() {
            $scope.selectedLocations = _.clone(initial_locations);
            storageService.remove(_locationsList);
            storageService.remove(_selectedLocations);
        };

        var generateChart = function(data) {
            $scope.status = "Loading graph...";
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
                                columns.push(_(['ID' + d.name]).concat(_.map(d.data, function(n) { return new Date(_.get(n, 'date.local')); })).value());
                                columns.push(_([d.name]).concat(_.map(d.data, function(n) { return new Date(_.get(n, 'value')); })).value());
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
                            title: function(x) { return x; }
                        }
                    }
                }); // end of c3.generate
            $scope.status = '';
        };

        var updateGraph = function(data) {
            $scope.chart.load({
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
                        columns.push(_(['ID' + d.name]).concat(_.map(d.data, function(n) { return new Date(_.get(n, 'date.local')); })).value());
                        columns.push(_([d.name]).concat(_.map(d.data, function(n) { return new Date(_.get(n, 'value')); })).value());
                    });
                    return columns;
                }()
            });
        };

        var removeInvalid = function(results) {
            return _.remove(results, function(r) {
                return r.value == -999;
            });
        };

        var getDataAndGraph = function(locations, data) {
            data = data || [];
            var _progress = (data.length+1) + "/" + (locations.length+data.length);
            $scope.status = "Fetching data for selected locations..." + _progress;
            if (locations.length > 0) {
                var location = locations.pop();
                var uri = URI(URLService.getUrl('measurements'));
                uri.addSearch('country', location.country);
                uri.addSearch('city', location.city);
                uri.addSearch('location', location.location);
                uri.addSearch('parameter', graph_defaults.parameter);
                uri.addSearch('date_from', graph_defaults.date_from);
                uri.addSearch('limit', graph_defaults.limit);

                $http.get(uri.toString())
                    .success(function(response) {
                        removeInvalid(response.results);
                        data.push({
                            'id': location.country + '-' + location.location,
                            'name': location.location + ', ' + location.city,
                            'data': response.results
                        });
                        getDataAndGraph(locations, data);
                    });
            } else {
                generateChart(data);
            }
        };  // end of getDataAndDraw

        $scope.updateGraph = function() {
            // just redraw everything until
            // you figure out how to update properly
            if($scope.chart) {
                $scope.chart = $scope.chart.destroy();
            }
            //graph_defaults.date_from = $scope.date_from;
            getDataAndGraph(_.clone($scope.selectedLocations));
        };

        getDataAndGraph(_.clone($scope.selectedLocations));
    }

})();
