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
