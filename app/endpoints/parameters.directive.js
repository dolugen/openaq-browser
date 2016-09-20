(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('parametersTable', parametersTable);

    function parametersTable() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/parameters-table.html',
        };
    }

})();

