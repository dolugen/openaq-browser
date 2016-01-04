(function() {
    angular
        .module('app.endpoints')
        .directive('latestForm', function() {
            return {
                'restrict': 'E',
                'templateUrl': 'app/endpoints/latest-form.html',
            };
        });
})();
