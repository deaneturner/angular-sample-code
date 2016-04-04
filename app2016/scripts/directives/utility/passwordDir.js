'use strict';
define(function () {
    return function (app) {
        app.register.directive('password', ['$timeout',
            function ($timeout) {
                return {
                    require: 'ngModel',
                    scope: {
                        firstname: '=',
                        lastname: '='
                    },
                    link: function (scope, elm, attrs, ctrl) {
                        var firstName,
                            lastName,
                            modelController,
                            isDigitized,
                            isFirstLastName;

                        isDigitized = function (value) {
                            return /^.*[0-9].*/.test(value);
                        };

                        isFirstLastName = function (firstName, lastName, viewValue) {
                            var result = false;

                            if (firstName || lastName) {
                                if (firstName && (viewValue === firstName)) {
                                    result = true;
                                }
                                if (lastName && (viewValue === lastName)) {
                                    result = true;
                                }
                                if (firstName && lastName && (viewValue === (firstName + lastName))) {
                                    result = true;
                                }
                            }

                            return result;
                        };

                        scope.$watch('firstname', function (newVal, oldVal) {
                            modelController = ctrl;
                            if (newVal !== oldVal) {
                                firstName = newVal;
                                ctrl.$validators.password(modelController.$modelValue, modelController.$viewValue);
                            }
                        });
                        scope.$watch('lastname', function (newVal, oldVal) {
                            modelController = ctrl;
                            if (newVal !== oldVal) {
                                lastName = newVal;
                                ctrl.$validators.password(modelController.$modelValue, modelController.$viewValue);
                            }
                        });

                        ctrl.$validators.password = function (modelValue, viewValue) {
                            if (ctrl.$isEmpty(modelValue)) {
                                ctrl.$setPristine();
                                // consider empty models to be valid
                                return true;
                            }

                            // valid characters
                            if (/^[a-zA-Z0-9\-\'\_\.]+$/.test(viewValue)) {
                                if (isDigitized(viewValue) && !isFirstLastName(firstName, lastName, viewValue)) {
                                    return true;
                                }
                            }

                            // it is invalid
                            return false;
                        };
                    }
                };
            }]
        );

        app.register.directive('passwordConfirm', ['$timeout',
            function ($timeout) {
                return {
                    require: 'ngModel',
                    scope: {
                        passwordConfirm: '='
                    },
                    link: function (scope, elm, attrs, ctrl) {
                        var passwordConfirm, modelController;

                        scope.$watch('passwordConfirm', function (newVal, oldVal) {
                            modelController = ctrl;
                            if (newVal && (newVal !== oldVal)) {
                                passwordConfirm = newVal;
                                if (modelController.$viewValue !== passwordConfirm) {
                                    modelController.$setValidity('passwordConfirm', false);
                                }
                                else {
                                    modelController.$setValidity('passwordConfirm', true);
                                }
                            }
                        });

                        ctrl.$validators.passwordConfirm = function (modelValue, viewValue) {
                            if (ctrl.$isEmpty(modelValue)) {
                                // consider empty models to be valid
                                return true;
                            }

                            if (viewValue === passwordConfirm) {
                                return true;
                            }

                            // it is invalid
                            return false;
                        };
                    }
                };
            }]
        );
    };
});
