(function() {
    'use strict';

    angular
        .module('app.core')
        .factory("errors", function($rootScope){
            return {
                catch: function(message){
                    message = message || "Failed to get data. Try again in a few minutes.";
                    $rootScope.message = message;
                }
            };
        });

})();
