'use strict';
define(['scripts/common/configs/configApp',
        'scripts/common/services/httpservice/httpApp'
    ],
    function () {
        return function (app) {
            app.register.factory('studentApiSrv', ['$q', 'config', 'httpSrv', 'httpConfig', '$timeout',
                function ($q, config, httpSrv, httpConfig, $timeout) {
                    console.log('Entering Api: Student');

                    var service = {};

                    service.getStudents = function (id, filter) {
                        var defer = $q.defer();
                        var query = '';

                        if (id !== null) {
                            query = '?id=' + id;

                        } else if (filter !== null) {
                            query = '?filter=' + filter;
                        } else {
                            query = '';
                        }

                        httpSrv.callAPI('GET', httpConfig.url.student.getStudents + query)
                            .then(
                                function (data) {
                                    defer.resolve(data);
                                },
                                // failure
                                function (error) {
                                    defer.reject(error);
                                }
                            );

                        return defer.promise;
                    };

                    service.getStudentLevels = function (schoolId) {
                        var defer = $q.defer();
                        $timeout(function () {
                            defer.resolve(
                                [
                                    {
                                        id: 1,
                                        name: 'Level 1'
                                    },
                                    {
                                        id: 2,
                                        name: 'Level 2'
                                    },
                                    {
                                        id: 3,
                                        name: 'Level 3'
                                    }
                                ]
                            );
                        });

                        return defer.promise;
                    };

                    service.getStudentList = function (paramObj) {
                        var defer = $q.defer(),
                            query,
                            url = httpConfig.url.student.getStudentList;

                        url = url.replace(':school', paramObj.school);
                        url = url.replace(':class', paramObj.class);

                        // remove school and class params from query string
                        delete paramObj.school;
                        delete paramObj.class;
                        query = httpSrv.getQueryString(paramObj);

                        httpSrv.callAPI('GET', url + query)
                            .then(
                                function (data) {
                                    defer.resolve(data);
                                },
                                // failure
                                function (error) {
                                    defer.reject(error);
                                }
                            );

                        return defer.promise;
                    };

                    service.getStudentForId = function (id) {

                        var defer = $q.defer(),
                            url = httpConfig.url.student.getStudentForId.replace(':studentId', id);

                        httpSrv.callAPI('GET', url)
                            .then(
                                function (data) {
                                    defer.resolve(data);
                                },
                                // failure
                                function (error) {
                                    defer.reject(error);
                                }
                            );

                        return defer.promise;
                    };

                    service.create = function (data) {

                        var defer = $q.defer(),
                            url = httpConfig.url.student.create;

                        httpSrv.callAPI('POST', url, data)
                            .then(
                                function (data) {
                                    defer.resolve(data);
                                },
                                // failure
                                function (error) {
                                    defer.reject(error);
                                }
                            );

                        return defer.promise;
                    };

                    service.update = function (data) {

                        var defer = $q.defer(),
                            url = httpConfig.url.student.update;

                        httpSrv.callAPI('PUT', url, data)
                            .then(
                                function (data) {
                                    defer.resolve(data);
                                },
                                // failure
                                function (error) {
                                    defer.reject(error);
                                }
                            );

                        return defer.promise;
                    };

                    service.getStudentEnrollments = function (id, school) {
                        var defer,
                            url,
                            query;

                        defer = $q.defer();
                        url = httpConfig.url.student.getStudentEnrollments.replace(':studentId', id);
                        query = '';

                        if (school !== null) {
                            query = '?school=' + school;
                        }

                        httpSrv.callAPI('GET', url + query)
                            .then(
                                function (data) {
                                    defer.resolve(data);
                                },
                                // failure
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
