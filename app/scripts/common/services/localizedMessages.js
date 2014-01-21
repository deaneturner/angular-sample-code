'use strict';

/**
 * @ngdoc service
 * @name common.localizedMessages:localizedMessages
 * @requires common.i18Messages:i18nMessages
 * @description
 * A service used to retrieve localized strings and messages.  Provides support for parameter replacement using an
 * additional parameter set.
 * @example
 *   For a message key equal to:
 *
 *        first.and.last: 'My first name is {(firstName}} and my last is {{lastName}}.'
 *
 *   In JavaScript:
 *
 *        localizationMessages.get('first.and.last', {
 *            firstName: 'foo',
 *            lastName: 'bar'
 *        });
 *
 *    Will return:
 *
 *        My first name is foo and my last is bar.
 */
angular.module('common.localizedMessages', ['common.i18nMessages']).
    factory('localizedMessages', ['$interpolate', 'i18nMessages', function ($interpolate, i18nMessages) {

  var handleNotFound = function (msg, msgKey) {
    return msg || '?' + msgKey + '?';
  };

  return {
      /**
       * @ngdoc method
       * @name common.localizedMessages:localizedMessages#get
       * @description Gets the translated value, with string replament parameters (if given).
       * @methodOf common.localizedMessages:localizedMessages
       * @param {string} msgKey - The message key value to be translated.
       * @param {Object} [interpolatePparams] - The string replacement parameters to be injected into the message key.
       * @returns {string} The translated message value.
       */
    get : function (msgKey, interpolateParams) {
      var msg =  (i18nMessages.getLocalized())[msgKey];
      if (msg) {
        return $interpolate(msg)(interpolateParams);
      } else {
        return handleNotFound(msg, msgKey);
      }
    }
  };
}]);