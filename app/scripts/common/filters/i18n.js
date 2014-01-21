'use strict';

/**
 * @ngdoc filter
 * @name common.filters:i18n
 * @function
 *
 * @description Localization for expressions using a filter.
 * @param {string} msgKey - The message key value to be translated.
 * @param {Object} [parameters] - The string replacement parameters to be injected into the message key.
 * @returns {string} The translated message value.
 *
 * @example
 *   For a message key equal to:
 *
 *        first.and.last: 'My first name is {firstName} and my last is {lastName}.'
 *
 *   In an expression:
 *
 *        {{ 'first.and.last' | i18n:{ firstName: 'foo', lastName: 'bar'} }}
 *
 *    Will return:
 *
 *        My first name is foo and my last is bar.
 */
angular.module('common.filters', ['common.localizedMessages']).
    filter('i18n', ['localizedMessages', function (localizedMessages) {

        return function (key, interpolateParams) {
            return localizedMessages.get(key, interpolateParams);
        };
    }
    ]);