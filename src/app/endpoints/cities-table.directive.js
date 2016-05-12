(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('citiesTable', citiesTable);

    function citiesTable() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/cities-table.directive.html',
        };
    }
})();
