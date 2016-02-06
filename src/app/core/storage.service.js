(function() {
    'use strict';

    angular
        .module('app.core')
        .service('storageService', storageService);

    function storageService() {
        var service = {
            get: get,
            set: set,
            remove: remove
        };
        return service;

        function get(key) {
            return JSON.parse(localStorage.getItem(key));
        }

        function set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }

        function remove(key) {
            localStorage.removeItem(key);
        }

    }
})();
