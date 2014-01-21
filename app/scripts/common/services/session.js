'use strict';

/**
 * @ngdoc service
 * @name common.services:session
 * @description A service to manage the user's session.
 */
angular.module('common.services')
    .factory('session', function ($http) {

    return {
        /**
         * Logout of the current session.
         *
         * @param addConfig A HTTP config object (e.g. {params: {id: "001"}}).
         * @returns {*|f.logout}
         */
        /**
         * @ngdoc method
         * @name common.notifications:notifications#logout
         * @description Log the user out of the current session.
         * @methodOf common.services:session
         * @param {Object} addConfig A HTTP config object (e.g. {params: {id: "001"}}).
         */
        logout: function (addConfig) {

            var config = {};

            // merge the additional config with this method's config.
            angular.extend(config, addConfig);

            return $http.get('logout', config);
        }
    };
});