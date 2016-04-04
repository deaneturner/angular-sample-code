'use strict';
define([
        'scripts/common/configs/configApp',
        'scripts/teacher/services/navigationBar/teacherClassMgmtSrv'],
    function () {
        return ['$scope',
            'config',
            'teacherClassMgmtSrv',
            '$translate',
            'waitScreenSrv',
            '$timeout',
            '$state',
            function ($scope,
                      config,
                      service,
                      $translate,
                      waitScreenSrv,
                      $timeout,
                      $state) {
                var model,
                    resultSet;

                model = $scope.model = {};
                $scope.navigator = $scope.navigator || {};

                console.log('Entering Navigator Controller');

                resultSet = {
                    data: [],
                    load: function () {

                        console.log('TeacherRosterCtrl:getStudentList(' + JSON.stringify({
                                class: $state.params.class,
                                school: $state.params.school
                            }) + ')');
                        waitScreenSrv.toggleActivity(true, 'navigator-spinner');

                        service.getStudentList({
                            class: $state.params.class,
                            school: $state.params.school
                        }).then(function (response) {
                                angular.extend($scope.navigator, {
                                    studentList: (function () {
                                        var result = [];
                                        angular.forEach(response.items, function (student) {
                                            result.push({
                                                personId: student.personId,
                                                studentName: student.studentName
                                            });
                                        });

                                        return result;
                                    })()
                                });

                                // notify
                                $timeout(function () {
                                    waitScreenSrv.toggleActivity(false, 'navigator-spinner');
                                });
                            },
                            function (error) {
                                $translate('teacher.student.errors.getStudents').then(function (msg) {
                                    config.logger.error(msg, error);
                                });
                                waitScreenSrv.toggleActivity(false, 'navigator-spinner');
                            }
                        );
                    }
                };

                model.navigatorInit = false;

                var init = function () {
                    angular.extend($scope.navigator, {
                        student: {
                            personId: $state.params.student,
                            studentName: $state.params.studentName
                        },
                        goTo: function(stateName) {
                            $state.go(stateName, {
                                school: $state.params.school,
                                class: $state.params.class,
                                className: $state.params.className
                            });
                        }
                    });

                    resultSet.load();

                    model.navigatorInit = true;
                };

                // Need page to be there
                $timeout(function () {
                    init();
                });
            }];
    });
