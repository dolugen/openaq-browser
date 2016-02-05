(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('formQueryUrl', formQueryUrl);

    function formQueryUrl() {
        return {
            'templateUrl': 'app/core/query-url.html'
        };
    }

})();
