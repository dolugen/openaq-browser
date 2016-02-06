(function() {
    'use strict';

    angular
        .module('app.core')
        .config(config);

    function config($compileProvider) {
        $compileProvider.debugInfoEnabled(true);
    }

})();
