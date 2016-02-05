(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('countriesTable', countriesTable);

    function countriesTable() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/countries-table.html',
        };
    }

})();

