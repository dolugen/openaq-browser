(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('constant', {
            API_HOST: "https://api.openaq.org/v1/",
            API_ENDPOINTS: [
                'cities',
                'countries',
                'fetches',
                'latest',
                'locations',
                'measurements',
                'parameters',
                'sources'
            ]
        });
                 
})();
