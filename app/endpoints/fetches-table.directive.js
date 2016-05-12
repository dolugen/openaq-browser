(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('fetchesTable', fetchesTable);

    function fetchesTable() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/fetches-table.directive.html',
        };
    }
})();
