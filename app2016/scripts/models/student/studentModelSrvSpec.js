'use strict';

define(['scripts/models/modelsApp', 'scripts/models/student/studentModelSrv'], function () {

    describe('Model: studentModelSrv', function () {
        var targetSrv,
            defer,
            $q,
            serviceMock = {
                getStudents: function (type, url, params, header) {
                    defer = $q.defer();
                    return defer.promise;
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
            wsSrvMock = {
                start: function () {
                }
            },
            configMock = {
                webSocketMock: true,
                keepAliveTimeout: 20,   // Time is in minnutes
                keepAliveWaitTimeout: 8,
                keepAliveMembers: {},
                urlList: 'TE, SRI, IR, LTI, ILT, LRS, R180U, LOGOUT, KEEPALIVE',
                urls: {}
            },
            $rootScope;

        beforeEach(function () {
            serviceMock = {
                getStudents: function (id, filter) {
                    defer = $q.defer();

                    return defer.promise;
                }
            };
        });

        beforeEach(angular.mock.module('modelsApp', function ($provide) {
            $provide.value('api', serviceMock);
            $provide.value('studentApiSrv', serviceMock);
            $provide.provider('$futureState', futureState);
            $provide.value('config', configMock);
            $provide.value('wsSrv', wsSrvMock);
        }));

        beforeEach(angular.mock.inject(
            function (_$rootScope_, $controller, $injector, $httpBackend, _$translate_) {
                $q = $injector.get('$q');
                targetSrv = $injector.get('studentModelSrv');
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

        it('should set success to be true if resolved', function () {
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

        it('should set success to be false if rejected', function () {
            var result = true;

            targetSrv.getStudents().then(function (data) {
                result = data;
            }, function (error) {
                result = error;
            });

            defer.reject({value: false});

            $rootScope.$apply();

            expect(result.value).toBe(false);
        });
    });

});

