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

        function fetches(params) {
            return get('fetches', params);
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
