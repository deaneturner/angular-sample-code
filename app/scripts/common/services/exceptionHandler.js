'use strict';

/**
 * @ngdoc object
 * @name common.exceptionHandler:exceptionHandler
 * @requires common.i18nNotifications:i18nNotifications
 * @requires common.i18nMessages:i18nMessages
 * @description
 *
 * Provides a global, default, error handler for XHR calls.
 *
 * **Fatal Errors**
 *
 * The interceptor will both notify the user of a fatal error via the UI, and log the error to the console.
 *
 * Messages are predefined according to HTTP status code:
 *
 *      case 401:
 *          msgKey = 'errors.authentication';
 *      case 403:
 *          msgKey = 'errors.authentication';
 *      case 500:
 *          msgKey = 'errors.server';
 *      default:
 *          msgKey = 'errors.error';
 *
 * See the {@link common.i18nNotifications:i18nNotifications i18nNotifications} service for details regarding UI notification.
 *
 * **Non-fatal Errors**
 *
 * The interceptor will also handle non-fatal errors by inspecting the errors parameter for notification objects.
 *
 * An XHR response errors parameter can contain one or many notification object, and it uses the
 * {@link common.i18nNotifications:i18nNotifications i18nNotifications} service notification objects to provide
 * translation and string parameter replacement.
 *
 *      {"errors": {"msgKey":"schedule.errors.carrierlist.is.incomplete"}
 *
 *      {"errors": [{"msgKey":"schedule.errors.carrierlist.is.incomplete","params":{"id":123}},{"msgKey":"schedule.errors.carrierlist.wrong.company","params":{"id":123}}]
 *
 *
 *
 * @example
 *
 * No failure callback is necessary:
 *
 *      hrp.getCarrierList().
 *        success(function(data) {
 *          $scope.carrierSelector = data.file_list;
 *        });
 *

 *
 * @example
 *
 * For an XHR response containing an errors parameter:
 *
 *      {"errors": [{"msgKey":"schedule.errors.carrierlist.is.incomplete","params":{"id":123}},{"msgKey":"schedule.errors.carrierlist.wrong.company","params":{"id":123}}]
 *
 * The interceptor will both notify the user of a non-fatal error via the UI, and log the error to the console.
 */
angular.module('common.exceptionHandler', ['common.i18nNotifications', 'common.i18nMessages']).
    config([
        '$httpProvider',
        function ($httpProvider) {

        $httpProvider.responseInterceptors.push(['$q', '$injector', function ($q, $injector) {
            return function (promise) {
                return promise.then(function (successResponse) {

                    var errors,
                        i18nNotifications = $injector.get('i18nNotifications'),
                        i18nNotificationSettings = $injector.get('i18nNotificationSettings');

                    if(successResponse.data && successResponse.data.errors) {

                        errors = successResponse.data.errors;

                        if(angular.isArray(errors)) {
                            angular.forEach(errors, function(value, key) {
                                i18nNotifications[i18nNotificationSettings.nonFatal](value.msgKey, 'warning', value.params, {});
                            });
                        }
                        else if(angular.isObject(errors)) {
                            i18nNotifications[i18nNotificationSettings.nonFatal](errors.msgKey, 'warning', errors.params || {}, {});
                        }
                    }

                    return successResponse;

                }, function (errorResponse) {
                    var msgKey,
                        i18nNotifications =  $injector.get('i18nNotifications'),
                        i18nNotificationSettings = $injector.get('i18nNotificationSettings');

                    switch (errorResponse.status) {
                        case 401:
                            msgKey = 'errors.authentication';
                            break;
                        case 403:
                            msgKey = 'errors.authentication';
                            break;
                        case 500:
                            msgKey = 'errors.server';
                            break;
                        default:
                            msgKey = 'errors.server.general';
                    }

                    i18nNotifications[i18nNotificationSettings.fatal](msgKey, 'error', {
                        time: moment().format('h:mm:ss a')
                    }, {});

                    return $q.reject(errorResponse);
                });
            };
        }]);
    }]);

/**
 * @ngdoc object
 * @name common.exceptionHandler:exceptionHandlerFactory
 * @description
 *
 * Overrides the default exception handler and instead, throws exceptions that will utilize the
 * {@link common.i18nNotifications:i18nNotifications  i18nNotifications} to produce notifications of fatal errors.
 *
 * Throwing an exception object will both notify the user of a fatal error via the UI, and log the error to the console.
 *
 * Note: For non-fatal notifications use the {@link common.i18nNotifications:i18nNotifications  i18nNotifications} service.  This service
 * provides the means to alter the message type e.g. warning, success, etc.
 *
 * @example
 *
 *  For the message key:
 *
 *      "errors.fatal.error": "Error: An unrecoverable error has occurred - {{time}}."
 *
 *  In JavaScript:
 *
 *      throw {
 *           msgKey: 'errors.fatal.error'
 *           params: {
 *              time: moment().format('h:mm:ss a')
 *          },
 *      }
 */
angular.module('common.exceptionHandler').factory('exceptionHandlerFactory', ['$injector', function ($injector) {
    return function ($delegate) {

        return function (exception, cause) {
            // Lazy load notifications to get around circular dependency
            //Circular dependency: $rootScope <- notifications <- i18nNotifications <- $exceptionHandler
            var i18nNotifications = $injector.get('i18nNotifications'),
                i18nNotificationSettings = $injector.get('i18nNotificationSettings'),
                localizedMessages = $injector.get('localizedMessages');


            // Pass through to original handler
            $delegate(exception.errorResponse || exception, cause || (exception.errorResponse && exception.errorResponse.data));

            if (exception.msgKey) {
                if (exception.params && exception.params.msgKey) {
                    exception.params.message = localizedMessages.get(exception.params.msgKey);
                }
                i18nNotifications[i18nNotificationSettings.fatal](exception.msgKey, exception.type || 'error', exception.params || {}, {});
            }
        };
    };
}]);

angular.module('common.exceptionHandler').
    config(['$provide', function ($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', 'exceptionHandlerFactory', function ($delegate, exceptionHandlerFactory) {
            return exceptionHandlerFactory($delegate);
        }]);
    }]);
