(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('constant', {
            API_HOST: "https://api.openaq.org/v1/"
        })
        .constant('ENDPOINTS', [
            'cities',
            'countries',
            'latest',
            'locations',
            'measurements'
        ]);

})();
