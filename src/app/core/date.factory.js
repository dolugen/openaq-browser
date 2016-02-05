(function() {
    'use strict';

    angular
        .module('app.core')
        .service('dateFactory', dateFactory);

    function dateFactory() {
        function yesterday() {
            var _d = new Date(); 
            _d.setDate(_d.getDate() - 1);
            return _d.toISOString().slice(0, 10);
        }

        function weekAgo() {
            var _d = new Date();
            _d.setDate(_d.getDate() - 7);
            return _d.toISOString().slice(0, 10);
        }

        return {
            yesterday: yesterday,
            weekAgo: weekAgo
        };
    }

})();
