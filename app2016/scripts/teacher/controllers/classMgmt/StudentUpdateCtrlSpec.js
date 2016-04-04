'use strict';

define(['scripts/teacher/controllers/classMgmt/StudentUpdateCtrl'],
    function (targetCtrl) {

        describe('Class Mgmt - Student Update Controller Test', function () {
            var scope,
                configMock,
                serviceMock,
                stateMock,
                defer,
                $q,
                tstCtrl,
                $translate,
                $timeout,
                $httpBackend,
                $rootScope;

            beforeEach(angular.mock.module('teacherApp'));

            beforeEach(function () {

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
                stateMock = {
                    params: {
                        school: 'schoolId',
                        class: 'classId'
                    },
                    studentUpdate: {
                        params: {
                            class: 'classId'
                        }
                    },
                    current: {
                        name: 'name'
                    }
                };
                configMock = {
                    logger: {
                        options: '',
                        error: function (msg) {
                            return msg;
                        }
                    },
                    userACL: {
                        Id: 'aaa'
                    },
                    keepAliveTimeout: 20,   // Time is in minnutes
                    keepAliveWaitTimeout: 8,
                    keepAliveMembers: {},
                    urlList: 'TE, SRI, IR, LTI, ILT, LRS, R180U, LOGOUT, KEEPALIVE',
                    urls: {}
                };

                module(function ($provide) {
                    $provide.value('studentSrv', serviceMock);
                    $provide.value('config', configMock);
                    $provide.value('$state', stateMock);
                    $provide.provider('$translate', function () {
                        var store = {};
                        this.get = function () {
                            return false;
                        };
                        this.preferredLanguage = function () {
                            return false;
                        };
                        this.storage = function () {
                            return false;
                        };
                        this.translations = function () {
                            return {};
                        };

                        this.$get = ['$q', function ($q) {
                            var $translate = function (key) {
                                var deferred = $q.defer();
                                deferred.resolve(key);
                                return deferred.promise;
                            };

                            $translate.addPair = function (key, val) {
                                store[key] = val;
                            };
                            $translate.isPostCompilingEnabled = function () {
                                return false;
                            };
                            $translate.preferredLanguage = function () {
                                return false;
                            };
                            $translate.storage = function () {
                                return false;
                            };
                            $translate.storageKey = function () {
                                return true;
                            };
                            $translate.use = function () {
                                return false;
                            };
                            $translate.instant = function () {
                                return false;
                            };

                            return $translate;
                        }];
                    });
                });
            });

            beforeEach(angular.mock.inject(
                function (_$rootScope_, $controller, $injector, _$translate_, _$timeout_, _$httpBackend_) {
                    scope = _$rootScope_.$new();
                    $q = $injector.get('$q');
                    $timeout = _$timeout_;
                    $translate = _$translate_;
                    $httpBackend = _$httpBackend_;
                    $rootScope = _$rootScope_;

                    $httpBackend.whenGET().respond(200);

                    tstCtrl = $controller(targetCtrl, {
                        '$scope': scope,
                        'config': configMock,
                        'service': serviceMock,
                        '$translate': $translate,
                        '$timeout': $timeout,
                        '$state': stateMock
                    });

                    // controller's init function is wrapped in a timer
                    $timeout.flush();
                }));

            /*
             * Controller Bootstrap
             */
            it('scope model classMgmtStudentUpdateInit to be true', function () {
                expect(scope.model.classMgmtStudentUpdateInit).toBeFalsy();
            });

            it('scope model to be defined', function () {
                expect(scope.model).toBeDefined();
            });

            it('school list controller exist', function () {
                expect(tstCtrl).toBeDefined();
            });

            it('should set resultSet properties, if load is resolved', function () {
                defer.resolve([{
                    meta: {}
                }]);

                $rootScope.$apply();

                expect(scope.resultSet.data).toEqual({});
            });

            it('should notify user of failure, if load is not resolved', function () {
                spyOn(configMock.logger, 'error');

                defer.reject({error: 'Message relating to the error condition'});

                $rootScope.$apply();

                expect(configMock.logger.error).toHaveBeenCalled();
            });
        });
    });
