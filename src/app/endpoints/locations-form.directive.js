(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('locationsForm', locationsForm);

    function locationsForm() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/locations-form.html',
        };
    }
})();
