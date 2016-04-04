'use strict';

define(['_',
        'moment',
        'scripts/common/configs/configApp',
        'scripts/apis/apiApp'],
    function () {
        return function (app) {
            app.register.factory('studentModelSrv', ['config', 'studentApiSrv', '$q',
                function (config, api, $q) {
                    console.log('Entering Student Model Service');

                    var service = {},
                        fields = [
                            {
                                name: 'person.dob',
                                type: 'single',
                                modelName: 'dob',
                                format: {
                                    in: function (value) {
                                        var result = value;

                                        if (value) {
                                            result = new Date(value);
                                        }

                                        return result;
                                    },
                                    out: function (value) {
                                        var result = value;

                                        if (value) {
                                            result = moment(value).unix() * 1000;
                                        }

                                        return result;
                                    }
                                }
                            }],

                        processFieldData = function (data, direction) {
                            var getFieldData = function (prop, field, data) {
                                    var result,
                                        format,
                                        value;

                                    value = (field.name).split('.').reduce(function (a, b) {
                                        return a[b];
                                    }, data);

                                    if (field.format[direction]) {
                                        result = field.format[direction](value);
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

                    var studentModel = function (data) {
                        return angular.copy(data);
                    };

                    service.getStudents = function (id, filter) {
                        var defer = $q.defer();

                        $q.all([
                            api.getStudents(id, filter)
                        ]).then(
                            function (data) {
                                service.model = studentModel(data[0]);

                                defer.resolve(service.model);
                            },
                            function (error) {
                                defer.reject(error);
                            }
                        );

                        return defer.promise;
                    };

                    service.getStudentList = function (id, filter) {
                        var defer = $q.defer();

                        $q.all([
                            api.getStudentList(id, filter)
                        ]).then(
                            function (data) {
                                service.model = studentModel(data[0]);

                                defer.resolve(service.model);
                            },
                            function (error) {
                                defer.reject(error);
                            }
                        );

                        return defer.promise;
                    };

                    service.getStudentForId = function (id) {
                        var defer = $q.defer();

                        $q.all([
                            api.getStudentForId(id)
                        ]).then(
                            function (data) {
                                service.model = studentModel(data[0]);
                                if (fields.length) {
                                    processFieldData(service.model.items[0], 'in');
                                }
                                defer.resolve(service.model);
                            },
                            function (error) {
                                defer.reject(error);
                            }
                        );

                        return defer.promise;
                    };

                    service.create = function (data) {
                        var defer = $q.defer();

                        service.model = studentModel(data);

                        if (fields.length) {
                            processFieldData(service.model, 'out');
                        }

                        $q.all([
                            api.create(service.model)
                        ]).then(
                            function (data) {
                                defer.resolve();
                            },
                            function (error) {
                                defer.reject(error);
                            }
                        );

                        return defer.promise;
                    };

                    service.update = function (data) {
                        var defer = $q.defer();

                        service.model = studentModel(data);

                        if (fields.length) {
                            processFieldData(service.model, 'out');
                        }

                        $q.all([
                            api.update(service.model)
                        ]).then(
                            function (data) {
                                defer.resolve();
                            },
                            function (error) {
                                defer.reject(error);
                            }
                        );

                        return defer.promise;
                    };

                    return service;
                }]);
        };
    });
