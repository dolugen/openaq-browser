(function() {
    'use strict';

    angular
        .module('app.endpoints')
        .directive('coordinatesForm', coordinatesForm);

    function coordinatesForm() {
        return {
            'restrict': 'E',
            'templateUrl': 'app/endpoints/coordinates-form.html',
        };
    }
})();
