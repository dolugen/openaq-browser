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
