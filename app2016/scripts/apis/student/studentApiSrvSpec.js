'use strict';

define(['scripts/apis/apiApp', 'scripts/apis/student/studentApiSrv'], function () {

    describe('Api: studentApiSrv', function () {
        var targetSrv,
            $q,
            configMock = {
                lang: '',
                keepAliveTimeout: 20,   // Time is in minnutes
                keepAliveWaitTimeout: 8,
                keepAliveMembers: {},
                urlList: 'TE, SRI, IR, LTI, ILT, LRS, R180U, LOGOUT, KEEPALIVE',
                urls: {}
            },
            httpConfigMock = {
                url: {
                    student: {
                        getStudents:'api/students',
                        getStudentList: 'api/schools/:school/classes/:class/students',
                        getStudentForId: 'api/students/:studentId',
                    }
                }
            },
            defer,
            serviceMock = {
                callAPI: function (type, url, params, header) {
                    defer = $q.defer();
                    return defer.promise;
                },
                getQueryString: function(paramObj) {
                    return '';
                }
            },
            futureState = {
                $get: function () {
                    return this;
                },
                addResolve: function (arg) {
                },
                stateFactory: function () {
                    var a, b;
                }
            },
            window = {
                navigator: {
                    language: 'en-us'
                }
            },
            $translate,
            $rootScope,
            msgState = true;

        beforeEach(angular.mock.module('apiApp', function ($provide) {
            $provide.value('httpSrv', serviceMock);
            $provide.value('config', configMock);
            $provide.value('httpConfig', httpConfigMock);
            $provide.provider('$futureState', futureState);
        }));

        beforeEach(angular.mock.inject(function (_$rootScope_, $controller, $injector, $httpBackend, _$translate_) {
            $q = $injector.get('$q');
            targetSrv = $injector.get('studentApiSrv');
            $translate = _$translate_;
            $rootScope = _$rootScope_;

            $httpBackend.whenGET().respond(true);
        }));

        it('Test service exist', function () {
            expect(targetSrv).toBeDefined();
        });

        it('Test getStudents exist', function () {
            expect(targetSrv.getStudents).toBeDefined();
        });

        it('should set success to be false if rejected', function () {
            var result = false;

            targetSrv.getStudents().then(function (data) {
                result = data;
            }, function (error) {
                result = error;
            });

            defer.resolve({value: true});

            $rootScope.$apply();

            expect(result.value).toBe(true);
        });

        it('should set success to be true if resolved', function () {
            var result = false;

            targetSrv.getStudents().then(function (data) {
                result = data;
            }, function (error) {
                result = error;
            });

            defer.reject({value: false});

            $rootScope.$apply();

            expect(result.value).toBe(false);
        });

        it('Test getStudentList exist', function () {
            expect(targetSrv.getStudentList).toBeDefined();
        });

        it('should set getStudentList success to be false if rejected', function () {
            var result = false,
                paramObj = {
                    school: 'schoolId',
                    class: 'classId'
                };

            targetSrv.getStudentList(paramObj).then(function (data) {
                result = data;
            }, function (error) {
                result = error;
            });

            defer.resolve({value: true});

            $rootScope.$apply();

            expect(result.value).toBe(true);
        });

        it('should set getStudentList success to be true if resolved', function () {
            var result = false,
                paramObj = {
                    school: 'schoolId',
                    class: 'classId'
                };

            targetSrv.getStudentList(paramObj).then(function (data) {
                result = data;
            }, function (error) {
                result = error;
            });

            defer.reject({value: false});

            $rootScope.$apply();

            expect(result.value).toBe(false);
        });

        it('should set getStudentForId success to be false if rejected', function () {
            var result = false,
                id = 'studentId';

            targetSrv.getStudentForId(id).then(function (data) {
                result = data;
            }, function (error) {
                result = error;
            });

            defer.reject({value: false});

            $rootScope.$apply();

            expect(result.value).toBe(false);
        });

        it('should set getStudentForId success to be true if resolved', function () {
            var result = false,
                id = 'studentId';

            targetSrv.getStudentForId(id).then(function (data) {
                result = data;
            }, function (error) {
                result = error;
            });

            defer.resolve([{items:[{value: true}]}]);

            $rootScope.$apply();

            expect(result[0].items[0].value).toBe(true);
        });
    });
});
