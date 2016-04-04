'use strict';

define([
        'angular',
        'scripts/student/studentApp',
        'scripts/common/configs/configApp',
        'scripts/models/modelsApp'
    ],
    function (angular) {
        var app;
        try {
            app = angular.module('testApp');
        } catch (err) {
            /* istanbul ignore next: not a testable item */
            app = angular.module('studentApp');
        }
        app = app.register || app;

        app.factory('studentSrv', ['config', 'studentModelSrv', 'studentEnrollmentsModelSrv', '$q',
            function (config, model, enrollmentsModel, $q) {
                console.log('Entering Class Management - Student Service');

                var service = {},
                    fields = [
                        {
                            name: 'person.dob',
                            type: 'single',
                            modelName: 'dob',
                            format: function (value) {
                                var result = value;

                                if (value) {
                                    result = new Date(value);
                                }
                                return result;
                            }
                        }],

                    processFieldData = function (data) {
                        var getFieldData = function (prop, field, data) {
                                var result;

                                result = (field.name).split('.').reduce(function (a, b) {
                                    return a[b];
                                }, data);

                                if (field.format) {
                                    result = field.format(result);
                                }

                                return result;
                            },

                            setFieldData = function (prop, field, data) {
                                var nameArr,
                                    parentObj;

                                nameArr = field.name.split('.');
                                nameArr.pop();
                                parentObj = nameArr.reduce(function (a, b) {
                                    return a[b];
                                }, data);

                                parentObj[field.modelName] = getFieldData(prop, field, data);
                            };

                        angular.forEach(fields, function (item) {
                            setFieldData('value', item, data);
                        });
                    };

                service.getStudentForId = function (id) {
                    var deferred = $q.defer();

                    $q.all([
                        model.getStudentForId(id)
                    ]).then(function (data) {
                            if (data[0].items.length && fields.length) {
                                processFieldData(data[0].items[0]);
                            }
                            deferred.resolve(data);
                        },
                        function (error) {
                            deferred.reject(error);
                        }
                    );

                    return deferred.promise;
                };

                service.create = function (data) {
                    var deferred = $q.defer();

                    $q.all([
                        model.create(data)
                    ]).then(function (data) {
                            //if (data[0].items.length && fields.length) {
                            //    processFieldData(data[0].items[0]);
                            //}
                            deferred.resolve(data);
                        },
                        function (error) {
                            deferred.reject(error);
                        }
                    );

                    return deferred.promise;
                };

                service.update = function (data) {
                    var deferred = $q.defer();

                    $q.all([
                        model.update(data)
                    ]).then(function (data) {
                            //if (data[0].items.length && fields.length) {
                            //    processFieldData(data[0].items[0]);
                            //}
                            deferred.resolve(data);
                        },
                        function (error) {
                            deferred.reject(error);
                        }
                    );

                    return deferred.promise;
                };

                service.getStudentEnrollments = function (id, school) {
                    var deferred = $q.defer();

                    $q.all([
                        enrollmentsModel.getStudentEnrollments(id, school)
                    ]).then(function (data) {
                            deferred.resolve(data[0]);
                        },
                        function (error) {
                            deferred.reject(error);
                        }
                    );

                    return deferred.promise;
                };

                return service;
            }
        ])
        ;
    });
