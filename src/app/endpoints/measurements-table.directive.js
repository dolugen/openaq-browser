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
