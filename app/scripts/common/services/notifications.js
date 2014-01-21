'use strict';

/**
 * @ngdoc service
 * @name common.notifications:notifications
 * @description A service to hold and manage notifications.
 *
 * Notifications are stored according to current route, next route, and/or sticky (should be available across all routes).
 *
 * Next route notifications must be explicitly added to tne next route array via the API.  Otherwise, current route notifications are lost
 * on successful route changes.
 *
 * If none of the storage options above are applicable or desired, the {@link common.i18nNotifications:i18nNotifications i18nNotifications} service
 * has a {@link common.i18nNotifications:i18nNotifications#notify notify} method which directly notifies without using storage.
 *
 *      A deligate method is required to use this option.  For example:
 *
 *      $scope.notifications.deligate = {
 *          config: (function() {
 *             toastr.options.closeButton = true;
 *             toastr.options.fadeOut = 10000;
 *         })(),
 *         notify: function(value) {
 *             toastr[value.type](value.message);
 *         }
 *     };
 */
angular.module('common.notifications', []).factory('notifications', ['$rootScope', function ($rootScope) {

    /**
    * @ngdoc property
    * @name common.notifications:notifications#notifications
    * @propertyOf common.notifications:notifications
    * @description Holds the notifications according to persistence across route changes.
    *  - Sticky notifications persists across all route changes until explicitly removed.
    *  - Current route notifications persist for the current route and are lost upon a route change.
    *  - Next route notifications are carried over to the next route. Next route notifications are transferred
    *  upon a successful route change - where they become current route notifications.
    *
    * @returns {Object} An object consisting of arrays: STICKY, ROUTE\_CURRENT, and ROUTE\_NEXT
    * @private
    */
    var notifications = {
            'STICKY': [],
            'ROUTE_CURRENT': [],
            'ROUTE_NEXT': []
        },


        notificationsService = {},

        /**
         * @ngdoc method
         * @name common.notifications:notifications#addNotification
         * @description Add the notification to the given array.
         * @methodOf common.notifications:notifications
         * @param {Array} notificationsArray The notifications array to add the notification to i.e. STICKY, ROUTE\_CURRENT, or ROUTE\_NEXT.
         * @param {Object} notificationObj The notification object in the form of {message: 'A message', type: 'error')
         * @returns {object} The notification object.
         * @private
         */
        addNotification = function (notificationsArray, notificationObj) {
            if (!angular.isObject(notificationObj)) {
                throw new Error("Only object can be added to the notification service");
            }
            notificationsArray.push(notificationObj);
            return notificationObj;
        };

    /**
     * @ngdoc event
     * @name common.notifications:notifications#routeChangeSuccess
     * @eventOf common.notifications:notifications
     * @event on
     * @description Copies the next route notification array into the current notifications array.  Empties the current
     * and next notification arrays.  This functionality allows selected notifications (those explicitly added to the
     * next route array) to be carried over to the next route.
     */
    $rootScope.$on('$routeChangeSuccess', function () {
        notifications.ROUTE_CURRENT.length = 0;

        notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
        notifications.ROUTE_NEXT.length = 0;
    });

    /**
     * @ngdoc method
     * @name common.notifications:notifications#getCurrent
     * @description Gets the current notifications (stick and current route).
     * @methodOf common.notifications:notifications
     * @returns {array} The current and sticky notifications.
     */
    notificationsService.getCurrent = function () {
        return [].concat(notifications.STICKY, notifications.ROUTE_CURRENT);
    };

    /**
     * @ngdoc method
     * @name common.notifications:notifications#pushSticky
     * @description Adds a notification to the sticky notifications array.
     * @methodOf common.notifications:notifications
     * @returns {array} The sticky notifications.
     */
    notificationsService.pushSticky = function (notification) {
        return addNotification(notifications.STICKY, notification);
    };

    /**
     * @ngdoc method
     * @name common.notifications:notifications#pushForCurrentRoute
     * @description Adds a notification to the current route notifications array.
     * @methodOf common.notifications:notifications
     * @returns {array} The current route notifications.
     */
    notificationsService.pushForCurrentRoute = function (notification) {
        return addNotification(notifications.ROUTE_CURRENT, notification);
    };

    /**
     * @ngdoc method
     * @name common.notifications:notifications#pushForNextRoute
     * @description Adds a notification to the next route notifications array.
     * @methodOf common.notifications:notifications
     * @returns {array} The next route notifications.
     */
    notificationsService.pushForNextRoute = function (notification) {
        return addNotification(notifications.ROUTE_NEXT, notification);
    };

    /**
     * @ngdoc method
     * @name common.notifications:notifications#remove
     * @description Removes a notification from any or all arrays (stick, current, and/or next).
     * @methodOf common.notifications:notifications
     * @param {Object} notification The notification to remove from any or all arrays (sticky, current, and/or next).
     */
    notificationsService.remove = function (notification) {
        angular.forEach(notifications, function (notificationsByType) {
            var idx = notificationsByType.indexOf(notification);
            if (idx > -1) {
                notificationsByType.splice(idx, 1);
            }
        });
    };

    /**
     * @ngdoc method
     * @name common.notifications:notifications#removeAll
     * @description Removes all notifications from a given type i.e. STICKY, ROUTE\_CURRENT, or ROUTE\_NEXT
     * @methodOf common.notifications:notifications
     */
    notificationsService.removeAll = function () {
        angular.forEach(notifications, function (notificationsByType) {
            notificationsByType.length = 0;
        });
    };

    return notificationsService;
}]);