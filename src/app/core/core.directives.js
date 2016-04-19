(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('formQueryUrl', formQueryUrl)
        .directive('paginationInputs', paginationInputs)
        .directive('fetchButton', fetchButton);

    function formQueryUrl() {
        return {
            'templateUrl': 'app/core/query-url.html'
        };
    }

    function paginationInputs() {
        return {
            'templateUrl': 'app/core/pagination-inputs.html'
        };
    }

    function fetchButton() {
        return {
            'templateUrl': 'app/core/fetch-button.html'
        };
    }

})();
