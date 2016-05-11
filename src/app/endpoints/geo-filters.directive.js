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
