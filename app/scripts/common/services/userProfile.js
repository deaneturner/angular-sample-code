/* global $: false */
'use strict';

/**
 * @ngdoc service
 * @name common.userProfile:userProfile
 * @description A service to load and manage user profile information.
 *
 * @example
 *
 * The user profile is stored on the $rootScope for easy access.
 *
 *      {{user.info.companyName}}
 *
 *  or
 *
 *      $rootScope.user.info.companyName
 */
angular.module('common.userProfile', ['common.i18nMessages']).
    factory('userProfile', function ($rootScope, $http) {

        return {
            /**
             * @ngdoc method
             * @name common.userProfile:userProfile#getInfo
             * @description Retrieves the employee's information.
             * @methodOf common.userProfile:userProfile
             * @param {Object} addConfig A HTTP config object (e.g. {params: {id: "001"}}).
             */
            getInfo: function (addConfig) {

                var config = {};

                // merge the additional config with this method's config.
                angular.extend(config, addConfig);

                return $http.get('userinfo', config);
            },

            /**
             * @ngdoc method
             * @name common.userProfile:userProfile#init
             * @description Initializes the employee's information and stores it on the root scope.
             * @methodOf common.userProfile:userProfile
             */
            init: function() {
                this.getInfo().
                    success(function (data) {

                        /*
                         * $rootScope.user may have been instantiated by another module (e.g. i18nMessages).
                         */
                        if($rootScope.user) {
                            $rootScope.user.info = data;
                        }
                        else {
                            $rootScope.user = {
                                info: data
                            }
                        }
                    });
            }
        };
    });