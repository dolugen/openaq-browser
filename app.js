(function() {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.endpoints',
        'app.graph'
    ]);

})();

(function() {
  'use strict';

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
        .directive('formQueryUrl', formQueryUrl)
        .directive('paginationInputs', paginationInputs)
        .directive('fetchButton', fetchButton);

    function formQueryUrl() {
        return {
            'templateUrl': 'app/core/query-url.html'
        };
    }

    function paginationInputs() {
        return {
            'templateUrl': 'app/core/pagination-inputs.html'
        };
    }

    function fetchButton() {
        return {
            'templateUrl': 'app/core/fetch-button.html'
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
            if (value !== null) {
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
            countries: countries,
            fetches: fetches
        };

        return service;

        function get(name, params, request_options) {
            params = params ? '?' + $.param(params) : '';
            request_options = request_options || { timeout: 10*1000 };

            return $http.get(apiRoot + name + params, request_options)
                .then(function(result) {
                    return $q.when(result.data);
                })
                .catch(function(message) {
                    $log.log('Failed to get data');
                    return $q.reject(message.data);
                });
        }

        function locations(params) {
            return get('locations', params, { timeout: 10*1000, cache: true });
        }

        function latest(params) {
            return get('latest', params);
        }

        function fetches(params) {
            return get('fetches', params);
        }

        function measurements(params) {
            return get('measurements', params);
        }

        function cities(params) {
            return get('cities', params, { timeout: 10*1000, cache: true });
        }

        function countries(params) {
            return get('countries', params, { timeout: 10*1000, cache: true });
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
                templateUrl: 'app/core/about.html',
                controller: 'AboutController'
            });
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('AboutController', AboutController);

    function AboutController($scope, dataService) {
        function isFetchOld(relativeDate) {
            // simple check to see if it's more than an hour old
            return relativeDate.indexOf("hour") > -1 ? true : false;
        }

        $scope.fetch = function() {
            dataService.countries({ limit: 0})
                .then(function(data) {
                    $scope.countries_count = data.meta.found;
                });
            dataService.locations({ limit: 0})
                .then(function(data) {
                    $scope.locations_count = data.meta.found;
                });
            dataService.measurements({ limit: 0})
                .then(function(data) {
                    $scope.measurements_count = data.meta.found.toLocaleString();
                });
            dataService.fetches({ limit: 1 })
            .then(function(data) {
                var relativeDate = moment(data.results[0].timeStarted).fromNow();
                $scope.last_fetch_relative = relativeDate;
                $scope.last_fetch_is_old = isFetchOld(relativeDate);
            });
        };
        
        $scope.fetch();
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
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
            if($scope[model]) {
                params[model] = $scope[model];
            } else {
                delete params[model];
            }
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
                    $scope.total = data.meta.found;
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
            'templateUrl': 'app/endpoints/cities-form.html',
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
        var uri = URLService.getUrl('countries');
        var params = {};
        $scope.query_url = uri.toString();

        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            $scope.query_url = URLService.updateUrl(uri, model, $scope[model]);
            if($scope[model]) {
                params[model] = $scope[model];
            } else {
                delete params[model];
            }
        };

        activate();

        $scope.submit = function() {
            activate();
        };

        function activate() {
            $scope.busy = 1;

            return dataService.countries()
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.total = data.meta.found;
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
        .directive('geoFilters', geoFilters);

    function geoFilters() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/geo-filters.directive.html',
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
            if($scope[model] !== '') {
                params[model] = $scope[model];
            } else {
                delete params[model];
            }
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
            var params = {
                country: $scope.country,
                limit: 1000
            };
            return dataService.cities(params)
                .then(function(data) {
                    $scope.cities = data.results;
                });
        };

        $scope.get_countries = function() {
            return dataService.countries()
                .then(function(data) {
                    delete params.city;
                    $scope.countries = data.results;
                });
        };
        $scope.get_countries();

        $scope.fetch = function() {
            $scope.busy = 1;

            return dataService.latest(params)
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.total = data.meta.found;
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
  'use strict';

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
  'use strict';

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
            if($scope[model] !== '') {
                params[model] = $scope[model];
            } else {
                delete params[model];
            }
        };

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
            var params = {
                limit: 1000
            };
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
            $scope.markers = {};
            $scope.busy = 1;

            return dataService.locations(params)
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.results.forEach(getMarkers);
                    $scope.total = data.meta.found;
                    $scope.busy = 0;
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
                    message: result.location + ", " + result.city + "<br/>" + result.count + " measurements",
                    draggable: false
                };
            }
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

    function MeasurementsController($http, $scope, $filter, URLService, dataService) {
        var uri = URI(URLService.getUrl('measurements'));
        var params = {};
        $scope.query_url = uri.toString();
        $scope.order_by = "date";
        $scope.sort = "desc";
        $scope.busy = 0;

        $scope.updateUrl = function(model) {
            var urlValue = $scope[model];
            if(model === "include_fields"){
                urlValue = formatIncludeFields();
            }
            if(["date_from", "date_to"].indexOf(model) > -1){
                urlValue = formatDateField(model);
            }
            $scope.query_url = URLService.updateUrl(uri, model, urlValue);
            if($scope[model]) {
                params[model] = urlValue;
            } else {
                delete params[model];
            }
        };

        function getIncludeFields() {
            var model = $scope.include_fields;
            var include_fields = [];
            for(var i = 0; i < Object.keys(model).length; i++){
                if(model[Object.keys(model)[i]] === true){
                    include_fields.push(Object.keys(model)[i]);
                }
            }
            return include_fields;
        }

        function formatIncludeFields() {
            return getIncludeFields().join();
        }

        function formatDateField(model) {
            return $filter('date')($scope[model], "yyyy-MM-dd");
        }

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
            var params = {
                limit: 1000
            };
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

            return dataService.measurements(params)
                .then(function(data) {
                    $scope.results = data.results;
                    $scope.total = data.meta.found;
                    $scope.limit = data.meta.limit;
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

    angular
        .module('app.endpoints')
        .directive('panelMain', panelMain);

    function panelMain() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/panel-main.directive.html',
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
            $http.get(uri.toString(), { cache: true })
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
                            },
                            padding: {
                                bottom: 3
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
                uri.addSearch('value_from', 0);

                $http.get(uri.toString(), { cache: true })
                    .success(function(response) {
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
