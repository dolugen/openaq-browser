(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('fetchesForm', fetchesForm);

    function fetchesForm() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/fetches-form.directive.html',
        };
    }
})();
