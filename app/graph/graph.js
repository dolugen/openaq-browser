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
