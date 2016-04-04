'use strict';
define(function () {
    return function (app) {
        app.register.filter('column', ['$filter', function ($filter) {
            return function (input, filter, isRemote) {
                var digits = 2,
                    filters = {
                        text: function () {
                            return input;
                        },
                        number: function () {
                            return $filter(filter)(input, digits);
                        },
                        percentage: function () {
                            return $filter('number')(input, digits) + '%';
                        },
                        dateTime: function () {
                            return $filter('date')(input, 'MMM d, y h:mm:ss a');
                        },
                        grades: function () {
                            return $filter('grades')(input);
                        },
                        array: function () {
                            return $filter('array')(input);
                        }
                    },
                    result;

                if (isRemote || !filter) {
                    // the sort is remote, so no check on remote column data type for sorting.
                    return input;
                }
                if (input === Infinity) {
                    return null;
                }

                if (filter.indexOf(':') > -1) {
                    digits = parseInt(filter.split(':')[1].trim());
                    filter = filter.split(':')[0].trim();
                }

                return filters[filter]();
            };
        }]);
    };
});
