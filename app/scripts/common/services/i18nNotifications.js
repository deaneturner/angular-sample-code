'use strict';

/**
 * @ngdoc service
 * @name common.i18nNotifications:i18nNotifications
 * @description A wrapper service which performs i18n translations before passing responsibility on to the
 * {@link common.notifications:notifications notifications} service.
 *
 * @example
 *
 * For a message key:
 *
 *      "schedule.errors.carrierlist.wrong.company": "Wrong company for carrier list. Company Id: {{id}}",
 *
 * In JavaScript
 *
 *      i18nNotifications.pushForCurrentRoute('schedule.errors.carrierlist.wrong.company', 'warning', {id: 123}, {});
 *
 */
angular.module('common.i18nNotifications', ['common.notifications', 'common.localizedMessages']).
    factory('i18nNotifications', ['localizedMessages', 'notifications', function (localizedMessages, notifications) {

        /**
         * @ngdoc method
         * @name common.i18nNotifications:i18nNotifications#prepareNotifications
         * @description Prepares the notification by translating using the {@link common.localizedMessages:localizedMessages common.localizedMessages} service.
         * @methodOf common.i18nNotifications:i18nNotifications
         * @param {string} msgKey - The message key value to be translated.
         * @param {string} type - The message key value to be translated.
         * @param {Object} [interpolateParams] - The string replacement parameters to be injected into the message key.
         * @param {Object} [otherProperties] - The string replacement parameters to be injected into the message key.
         * @returns {Object} The translated message object in the form of {message: 'A message', type: 'error').
         * @private
         */
        var prepareNotification = function (msgKey, type, interpolateParams, otherProperties) {
                return angular.extend({
                    message: localizedMessages.get(msgKey, interpolateParams),
                    type: type
                }, otherProperties);
            },
            I18nNotifications = {
                /**
                 * @ngdoc method
                 * @name common.i18nNotifications:i18nNotifications#pushSticky
                 * @description Adds a notification to the sticky notifications array.
                 * @methodOf common.i18nNotifications:i18nNotifications
                 * @param {string} msgKey - The message key value to be translated.
                 * @param {string} type - The message key value to be translated.
                 * @param {Object} [interpolateParams] - The string replacement parameters to be injected into the message key.
                 * @param {Object} [otherProperties] - The string replacement parameters to be injected into the message key.
                 * @returns {string} The sticky notifications.
                 */
                pushSticky: function (msgKey, type, interpolateParams, otherProperties) {
                    return notifications.pushSticky(prepareNotification(msgKey, type, interpolateParams, otherProperties));
                },
                /**
                 * @ngdoc method
                 * @name common.i18nNotifications:i18nNotifications#pushForCurrentRoute
                 * @description Adds a notification to the current route notifications array.
                 * @methodOf common.i18nNotifications:i18nNotifications
                 * @param {string} msgKey - The message key value to be translated.
                 * @param {string} type - The message key value to be translated.
                 * @param {Object} [interpolateParams] - The string replacement parameters to be injected into the message key.
                 * @param {Object} [otherProperties] - The string replacement parameters to be injected into the message key.
                 * @returns {array} The current route notifications.
                 */
                pushForCurrentRoute: function (msgKey, type, interpolateParams, otherProperties) {
                    return notifications.pushForCurrentRoute(prepareNotification(msgKey, type, interpolateParams, otherProperties));
                },
                /**
                 * @ngdoc method
                 * @name common.i18nNotifications:i18nNotifications#pushForNextRoute
                 * @description Adds a notification to the next route notifications array.
                 *
                 *      A deligate method is required to use this method.  For example:
                 *
                 *
                 *      $scope.notifications.deligate = {
                 *          config: (function() {
                 *              toastr.options.closeButton = true;
                 *              toastr.options.fadeOut = 10000;
                 *          })(),
                 *          notify: function(value) {
                 *              toastr[value.type](value.message);
                 *          }
                 *      };
                 * @methodOf common.i18nNotifications:i18nNotifications
                 * @param {string} msgKey - The message key value to be translated.
                 * @param {string} type - The message key value to be translated.
                 * @param {Object} [interpolateParams] - The string replacement parameters to be injected into the message key.
                 * @param {Object} [otherProperties] - The string replacement parameters to be injected into the message key.
                 * @returns {array} The next route notifications.
                 */
                pushForNextRoute: function (msgKey, type, interpolateParams, otherProperties) {
                    return notifications.pushForNextRoute(prepareNotification(msgKey, type, interpolateParams, otherProperties));
                },
                /**
                 * @ngdoc method
                 * @name common.i18nNotifications:i18nNotifications#notify
                 * @description Adds a notification without adding to a route notifications array.
                 * @methodOf common.i18nNotifications:i18nNotifications
                 * @param {string} msgKey - The message key value to be translated.
                 * @param {string} type - The message key value to be translated.
                 * @param {Object} [interpolateParams] - The string replacement parameters to be injected into the message key.
                 * @param {Object} [otherProperties] - The string replacement parameters to be injected into the message key.
                 */
                notify: function (msgKey, type, interpolateParams, otherProperties) {
                    if (!angular.isObject(this.delegate)) {
                        throw 'No delegate found.  Please configure a deligate function to notify.'
                    }
                    return this.delegate.notify(prepareNotification(msgKey, type, interpolateParams, otherProperties));
                },
                /**
                 * @ngdoc method
                 * @name common.i18nNotifications:i18nNotifications#getCurrent
                 * @description Gets the current notifications (stick and current route).
                 * @methodOf common.i18nNotifications:i18nNotifications
                 * @returns {array} The current and sticky notifications.
                 */
                getCurrent: function () {
                    return notifications.getCurrent();
                },
                /**
                 * @ngdoc method
                 * @name common.i18nNotifications:i18nNotifications#remove
                 * @description Removes a notification from any or all arrays (stick, current, and/or next).
                 * @methodOf common.i18nNotifications:i18nNotifications
                 * @param {Object} notification The notification to remove from any or all arrays (sticky, current, and/or next).
                 */
                remove: function (notification) {
                    return notifications.remove(notification);
                },

                /**
                 * @ngdoc method
                 * @name common.i18nNotifications:i18nNotifications#setDelegate
                 * @description Sets the delegate for use when no notification storage is desired.
                 * @methodOf common.i18nNotifications:i18nNotifications
                 * @param {Object} obj The object containing the notify method to delegate to.
                 */
                setDelegate: function (obj) {
                    this.delegate = obj;
                }
            };

        return I18nNotifications;
    }]);


angular.module('common.i18nNotifications').value('i18nNotificationSettings', {
    fatal: 'pushForCurrentRoute',
    nonFatal: 'notify',
    routeChange: 'pushForCurrentRoute'
});