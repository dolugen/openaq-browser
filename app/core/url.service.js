(function() {
    'use strict';

    angular
        .module('app.core')
        .service('URLService', URLService);

    function URLService(constant) {
        this.getUrl = function(name) {
            if (name === undefined) { throw new Error('API endpoint required.'); }
            var apiRoot = constant.API_HOST;
            if (constant.API_ENDPOINTS.indexOf(name) < 0) { throw new Error('API endpoint unavailable.'); }
            return apiRoot + name;
        };

        this.updateUrl = function(uri, key, value) {
            if (uri.hasQuery(key)) {
                uri.removeQuery(key);
            }
            if (value !== null) {
                uri.addSearch(key, value);
            }

            return uri.toString();
        };
    }

})();
