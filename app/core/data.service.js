(function() {
    'use strict';

    angular
        .module('app.core')
        .service('dataService', dataService);

    function dataService($q, $http, $log, constant) {
        var apiRoot = constant.API_HOST;

        var service = {
            cities: cities,
            countries: countries,
            fetches: fetches,
            latest: latest,
            locations: locations,
            measurements: measurements,
            parameters: parameters,
            sources: sources
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

        function cities(params) {
            return get('cities', params, { timeout: 10*1000, cache: true });
        }

        function countries(params) {
            return get('countries', params, { timeout: 10*1000, cache: true });
        }

        function fetches(params) {
            return get('fetches', params);
        }

        function latest(params) {
            return get('latest', params);
        }

        function locations(params) {
            return get('locations', params, { timeout: 10*1000, cache: true });
        }
        
        function measurements(params) {
            return get('measurements', params);
        }

        function parameters(params) {
            return get('parameters', params, { timeout: 10*1000, cache: true});
        }

        function sources(params) {
            return get('sources', params, { timeout: 10*1000, cache: true });
        }

    }

})();
