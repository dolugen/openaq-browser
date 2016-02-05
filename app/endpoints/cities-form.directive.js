(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('citiesForm', citiesForm);

    function citiesForm() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/locations-form.html',
        };
    }
})();
