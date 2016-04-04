'use strict';
define(function () {
    return function (app) {
        app.register.filter('arrayToString', ['$filter', function ($filter) {
            return function (input) {
                var result;

                if (input instanceof Array) {
                    result = input.toString().replace(/,/g, ', ');
                }
                else {
                    result = input;
                }

                return result;
            };
        }]);
    };
});
