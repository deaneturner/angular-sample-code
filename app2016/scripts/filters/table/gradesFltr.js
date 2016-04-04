'use strict';
define(function () {
    return function (app) {
        app.register.filter('grades', ['$filter', function ($filter) {
            return function (input) {
                var result;

                if (input[0] === input[1]) {
                    result = input[0];
                }
                else {
                    result = input[0] + ' - ' + input[1];
                }

                return result;
            };
        }]);
    };
});
