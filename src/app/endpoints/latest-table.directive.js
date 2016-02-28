(function() {
  'use strict';

    angular
        .module('app.endpoints')
        .directive('latestTable', function() {
            return {
                'restrict': 'E',
                'templateUrl': 'app/endpoints/latest-table.html',
            };
        });
})();
