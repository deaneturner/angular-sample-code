'use strict';
/**
 * @ngdoc service
 * @name common.i18nMessages:i18nMessages
 * @description
 * A service used to retrieve localized strings and messages from an XHR service.
 * The service should be initialized early during application startup (e.g. the run phase).
 * As necessary, the language can be changed on demand.
 *
 * @example
 *
 * To initialize and retrieve the localization key value pairs from a module:
 *
 *     .run(function (i18nMessages) {
 *           i18nMessages.init('locales', 'en');
 *       });
 */
angular.module('common.i18nMessages', ['common.filters']).
    service('i18nMessages', ['$http', '$rootScope', function ($http, $rootScope) {
        var localized = {};

        return {
            /**
             * @ngdoc method
             * @name common.i18nMessages:i18nMessages#init
             * @description Stores the localization key/value pairs locally.
             * @methodOf common.i18nMessages:i18nMessages
             * @param {string} path - The URI base path to the service which provides the language key/value pairs.
             * @param {string} lang - The language to use for translation.
             * @param {function} callback - The callback to execute on success.
             */
            init: function (path, lang, callback) {
                this.path = path;
                this.lang = lang;

                /*
                 * Put the language on the user profile
                 *
                 * $rootScope.user may have been instantiated by another module (e.g. userProfile).
                 */
                if ($rootScope.user) {
                    $rootScope.user.language = this.lang;
                }
                else {
                    $rootScope.user = {
                        language: this.lang
                    }
                }

                // get the language file and store in dictionary
                //TODO: Replace with cache-buster version below, when XHR service is implemented.  Remove temp /locales/en.json file.
                //$http.get(path + '/' + lang + '.json?' + new Date().getTime()).
                $http.get(path + '/' + lang + '.json').
                    success(function (data) {
                        localized = data;
                        callback && callback();
                    });
            },
            /**
             * @ngdoc method
             * @name common.i18nMessages:i18nMessages#setLang
             * @description Sets the language to the given value and reloads the translation key/value pair via XHR.
             * @methodOf common.i18nMessages:i18nMessages
             * @param {string} lang - The language to use for translation.
             */
            setLang: function (lang) {
                this.lang = lang;
                this.init(this.path, lang);
            },
            /**
             * @ngdoc method
             * @name common.i18nMessages:i18nMessages#get
             * @description Gets the translated key/value pairs as an object.
             * @methodOf common.i18nMessages:i18nMessages
             * @returns {Object} The translated key/value pairs.
             */
            getLocalized: function () {
                return localized;
            }
        };
    }]);