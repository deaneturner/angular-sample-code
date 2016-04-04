'use strict';

define(['angular-mocks', 'testfiles/testApp', 'scripts/teacher/services/classMgmt/studentSrv'], function (mock) {

    describe('ClassMgmt: studentSrv', function () {
        var targetSrv,
            configMock = {
                lang: ''
            },
            serviceMock,
            waitMock,
            $q,
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
            defer,
            window = {
                navigator: {
                    language: 'en-us'
                }
            },
            $translate,
            $rootScope;

        beforeEach(angular.mock.module('testApp', function ($provide) {
            $provide.value('studentModelSrv', serviceMock);
            $provide.value('config', configMock);
            $provide.provider('$futureState', futureState);
        }));

        beforeEach(angular.mock.inject(function (_$rootScope_, $controller, $injector, $httpBackend) {
            $q = $injector.get('$q');
            targetSrv = $injector.get('studentSrv');
            $rootScope = _$rootScope_;

            $httpBackend.whenGET().respond(true);

            serviceMock = {
                getStudentForId: function () {
                    defer = $q.defer();

                    return defer.promise;
                },
                getStudentEnrollments: function () {
                    defer = $q.defer();

                    return defer.promise;
                }
            };
        }));

        it('ClassMgmt student service exist', function () {
            expect(targetSrv).toBeDefined();
        });

        //it('should set success getStudentForId to be true if resolved', function () {
        //    var result = false;
        //
        //    targetSrv.getStudentForId().then(function (data) {
        //        result = data;
        //    }, function (error) {
        //        result = error;
        //    });
        //
        //    defer.resolve({
        //        meta:{'person.dob': {value: true}},
        //        items:[{
        //            person: {
        //                value: true
        //            }
        //        }]
        //    });
        //
        //    $rootScope.$apply();
        //
        //    expect(result[0].items[0].person.value).toBe(true);
        //});
        //
        //it('should set success to be false if getStudentForId is rejected', function () {
        //    var result = true;
        //
        //    targetSrv.getStudentForId().then(function (data) {
        //        result = data;
        //    }, function (error) {
        //        result = error;
        //    });
        //
        //    defer.reject({value: false});
        //
        //    $rootScope.$apply();
        //
        //    expect(result.value).toBe(false);
        //});
    });

});
