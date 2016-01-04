(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('NavController', NavController);

    function NavController($rootScope, $location) {
        $rootScope.urlLocation = $location;
    }

})();
