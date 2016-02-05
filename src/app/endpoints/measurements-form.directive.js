(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('measurementsForm', measurementsForm);

    function measurementsForm() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/measurements-form.html',
        };
    }
})();
