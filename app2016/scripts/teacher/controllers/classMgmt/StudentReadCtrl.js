/* globals sweetAlert */
'use strict';
define([
        'scripts/common/configs/configApp',
        'scripts/teacher/services/classMgmt/studentSrv'],
    function () {
        return ['$rootScope', '$scope', 'config', 'studentSrv', '$timeout', '$translate', 'waitScreenSrv', '$state', '$q', '$filter',
            function ($rootScope, $scope, config, service, $timeout, $translate, waitScreenSrv, $state, $q, $filter) {
                var vm, model, updateScreenStatus, resultSet, displayMngr, formMngr, getObject, setObject;

                vm = this;

                model = $scope.model = {};
                $scope.navigator = $scope.navigator || {};

                updateScreenStatus = function () {
                    waitScreenSrv.toggleActivity(false, 'classMgmtStudentRead-spinner');
                    displayMngr.init();
                };

                getObject = function (fieldName, data) {
                    // fieldName is in dot notation e.g. demographics.ayp
                    var result;

                    result = (fieldName).split('.').reduce(function (a, b) {
                        return a[b];
                    }, data);

                    return result;
                };

                setObject = function (fieldName, value, data) {
                    // fieldName is in dot notation e.g. demographics.ayp
                    var result,
                        keyPath,
                        objPath = [],
                        pathCount = 0;

                    keyPath = fieldName.split('.');
                    keyPath.reduce(function (a, b) {
                        objPath.push(a);
                        pathCount++;
                        return a[b];
                    }, data);
                    result = objPath[pathCount - 1][keyPath[pathCount - 1]] = value;

                    return result;
                };

                resultSet = {
                    data: {},
                    load: function (id) {
                        console.log('StudentReadCtrl:getStudent(' + id + ')');
                        waitScreenSrv.toggleActivity(true, 'classMgmtStudentRead-spinner');

                        service.getStudentForId(id).then(function (response) {
                                $timeout(function () {
                                    $scope.resultSet.meta = response[0].meta;
                                    $timeout(function () {
                                        $scope.resultSet.data = response[0].items[0] || {};
                                        formMngr.viewModel.load(response[0]);
                                    });
                                });
                                updateScreenStatus();
                            }, function (error) {
                                $translate('teacher.student.errors.getStudent').then(function (msg) {
                                    config.logger.error(msg, error);
                                });
                                updateScreenStatus();
                            }
                        );
                    }
                };

                displayMngr = {
                    mode: 'readonly',
                    contentBar: {
                        buttons: [{
                            title: 'Remove Student',
                            disabled: true,
                            onClick: function () {
                                return;
                            }
                        }],
                        breadcrumbs: {
                            separator: ' : ',
                            config: [
                                //    {
                                //    title: $state.studentRead && $state.studentRead.params.className,
                                //    onClick: function () {
                                //        $state.go($state.classMgmt.state, $state.classMgmt.params);
                                //    }
                                //},
                                {
                                    title: $state.studentRead && $state.studentRead.params.studentName
                                }]
                        }
                    },
                    navigator: {
                        tabs: {
                            tab0: {
                                title: $filter('translate')('classMgmt.student.nav.tab0')
                            },
                            tab1: {
                                title: $filter('translate')('classMgmt.student.nav.tab1')
                            },
                            tab2: {
                                title: $filter('translate')('classMgmt.student.nav.tab2')
                            },
                            tab3: {
                                title: $filter('translate')('classMgmt.student.nav.tab3')
                            },
                            tab4: {
                                title: $filter('translate')('classMgmt.student.nav.tab4')
                            },
                            tab5: {
                                title: $filter('translate')('classMgmt.student.nav.tab5')
                            },
                            default: 'tab0',
                            current: '',
                            previous: ''
                        },
                        buttons: [{
                            title: 'Cancel',
                            onClick: function () {
                                displayMngr.goHome();
                            }
                        }, {
                            title: 'Edit',
                            onClick: function () {
                                $state.studentUpdate = {
                                    state: 'teacherRoot.teachercontent.student.edit',
                                    params: $state.params
                                };

                                $state.studentUpdate.params.tab = displayMngr.navigator.tabs.current;

                                $state.go($state.studentUpdate.state, $state.studentUpdate.params);
                            },
                            getCssClasses: function () {
                                return ['active'];
                            }
                        }],
                        showValidSection: function () {
                            return false;
                        },
                        onSelectClick: function (personId) {
                            $state.studentRead = {
                                state: 'teacherRoot.teachercontent.student.read',
                                params: {
                                    school: $state.params.school,
                                    class: $state.params.class,
                                    className: $state.params.className,
                                    student: personId,
                                    studentName: (function () {
                                        var result,
                                            isFound;
                                        angular.forEach($scope.navigator.studentList, function (student) {
                                            if (!isFound && student.personId === personId) {
                                                result = student.studentName;
                                                isFound = true;
                                            }
                                        });
                                        return result;
                                    })()
                                }
                            };

                            $state.go($state.studentRead.state, $state.studentRead.params);
                        }
                    },
                    goHome: function () {
                        $state.go('teacherRoot.teachercontent.classMgmt.classRoster', $state.classMgmt.params);
                    },
                    init: function () {
                        var tabId,
                            selector;
                        // track tabs
                        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
                            $timeout(function () {
                                displayMngr.navigator.tabs.current = e.target.hash.slice(1);
                                displayMngr.navigator.tabs.previous = e.relatedTarget && e.relatedTarget.hash.slice(1);
                            });
                        });

                        // set tab to state given tab
                        if ($state.params.tab) {
                            tabId = $state.params.tab;
                        }
                        else {
                            tabId = displayMngr.navigator.tabs.default;
                        }

                        $timeout(function () {
                            selector = '#studentProfile a[href="#' + tabId + '"]';
                            $(selector).tab('show');
                        });

                        angular.extend($scope.navigator, displayMngr.navigator);
                        angular.extend($scope.navigator, {
                            mode: $scope.displayMngr.mode
                        });

                        formMngr.getListData().then(function (data) {
                            $timeout(function () {
                                formMngr.viewModel.enrollments = {
                                    map: data
                                };
                            });
                        });

                        return this;
                    }
                }
                ;

                formMngr = {
                    getListData: function (state) {
                        var deferred = $q.defer();

                        $q.all([
                            service.getStudentEnrollments($state.params.student, $state.params.school)
                        ]).then(
                            function (data) {
                                var map,
                                    key,
                                    value,
                                    msg;

                                map = {};
                                if (data[0].items[0]) {
                                    angular.forEach(data[0].items[0].items, function (enrollment) {
                                        key = enrollment.subProductId;
                                        value = enrollment.subProductName;
                                        msg = ' (' + enrollment.totalAvailable + ' Available)';
                                        map[key] = value + msg;
                                    });
                                }

                                deferred.resolve(map);
                            },
                            function (error) {
                                deferred.reject(error);
                            }
                        );

                        return deferred.promise;
                    },
                    getCssClasses: function (formName, fieldName) {
                        var result = [],
                            field;

                        field = $scope.studentForm[formName][fieldName];
                        if (field && field.$invalid && field.$touched) {
                            result.push('has-error');
                        }

                        return result;
                    },
                    labelDecorate: function (fieldName) {
                        var result,
                            requiredString = '*:',
                            isFieldConfig = fieldName && $scope.formMngr.fields[fieldName],
                            isRequired = isFieldConfig && $scope.formMngr.fields[fieldName].required,
                            isReadOnly = displayMngr.mode === 'readonly';

                        if (isFieldConfig && isRequired && !isReadOnly) {
                            result = requiredString;
                        }
                        else {
                            result = requiredString.slice(1, 2);
                        }

                        return result;
                    },
                    getMessage: function (field, value) {
                        var result,
                            fieldDef;

                        fieldDef = $scope.formMngr[field];

                        result = (fieldDef ? fieldDef[value] : '');

                        return result;
                    },
                    fields: {
                        'grade': {
                            required: true
                        },
                        'sisId': {
                            required: true
                        },
                        'person.firstName': {
                            required: true
                        },
                        'person.lastName': {
                            required: true
                        },
                        'person.userName': {
                            required: true
                        },
                        'person.password': {
                            required: true
                        },
                        'person.passwordConfirm': {
                            required: true
                        },
                        'person.dob': {
                            format: 'M/d/yyyy',
                            maxDate: new Date(),
                            dateOptions: {
                                formatYear: 'yy',
                                startingDay: 1
                            },
                            opened: false
                        },
                        'demographics.ayp': {
                            fieldName: 'demographics.ayp',
                            map: 'meta.ayp.map',
                            multiValue: true
                        },
                        'demographics.ethnicity': {
                            fieldName: 'demographics.ethnicity',
                            map: 'meta.ethnicity.map',
                            multiValue: true
                        },
                        'demographics.gender': {
                            fieldName: 'demographics.gender',
                            map: 'meta.gender.map',
                            multiValue: false
                        }
                    },
                    viewModel: {
                        'checkboxes': ['demographics.ayp', 'demographics.ethnicity', 'demographics.gender'],
                        'demographics.ayp': {},
                        'demographics.ethnicity': {},
                        'demographics.gender': {},
                        'listOfHmhGuardian[0].contactInfo.phoneNumberList[0].number': {
                            areaCode: '',
                            exchange: '',
                            number: ''
                        },
                        'listOfHmhGuardian[1].contactInfo.phoneNumberList[0].number': {
                            areaCode: '',
                            exchange: '',
                            number: ''
                        },
                        load: function (data) {
                            var obj,
                                config;

                            /*
                             * TODO: Write a directive that handles the three field phone number input.
                             */
                            var phone1, phone2;

                            try {
                                phone1 = formMngr.viewModel['listOfHmhGuardian[0].contactInfo.phoneNumberList[0].number'];
                                angular.extend(phone1, {
                                    areaCode: data.items[0].listOfHmhGuardian[0].contactInfo.phoneNumberList[0].number.slice(0, -7),
                                    exchange: data.items[0].listOfHmhGuardian[0].contactInfo.phoneNumberList[0].number.slice(3, -4),
                                    number: data.items[0].listOfHmhGuardian[0].contactInfo.phoneNumberList[0].number.slice(6)
                                });
                            }
                            catch (e) {
                                // suppress
                            }

                            try {
                                phone2 = formMngr.viewModel['listOfHmhGuardian[1].contactInfo.phoneNumberList[0].number'];
                                angular.extend(phone2, {
                                    areaCode: data.items[0].listOfHmhGuardian[1].contactInfo.phoneNumberList[0].number.slice(0, -7),
                                    exchange: data.items[0].listOfHmhGuardian[1].contactInfo.phoneNumberList[0].number.slice(3, -4),
                                    number: data.items[0].listOfHmhGuardian[1].contactInfo.phoneNumberList[0].number.slice(6)
                                });
                            }
                            catch (e) {
                                // suppress
                            }

                            // load checkbox mappings
                            angular.forEach(formMngr.viewModel.checkboxes, function (checkbox) {
                                config = formMngr.fields[checkbox];
                                obj = angular.copy(getObject(config.map, data));
                                angular.forEach(Object.keys(obj), function (key) {
                                    if (getObject(config.fieldName, data.items[0]).indexOf(key) > -1) {
                                        obj[key] = true;
                                    }
                                    else {
                                        obj[key] = false;
                                    }
                                });

                                formMngr.viewModel[config.fieldName] = obj;
                            });
                        }
                    }
                };

                console.log('Entering Class Management - Student Read Controller');

                model.classMgmtStudentReadInit = false;

                var init = function () {
                    $state.classMgmt = {
                        state: 'teacherRoot.teachercontent.classMgmt',
                        params: {
                            school: $state.params.school,
                            class: $state.params.class,
                            className: $state.params.className
                        }
                    };
                    if ($state.studentRead && ($state.params.class !== $state.studentRead.params.class)) {
                        /*
                         * Redirect back up to student list - User selects a new class context while on profile page.
                         */
                        $state.go($state.classMgmt.state, $state.classMgmt.params);
                    }

                    $scope.resultSet = resultSet;
                    $scope.displayMngr = displayMngr;
                    $scope.formMngr = formMngr;

                    vm.updateScreenStatus = updateScreenStatus;

                    $scope.resultSet.load($state.params.student);

                    // tab does not render on initialize (css managment of rendering) unless initialization true is set
                    // here, instead of after some xhr response.
                    model.classMgmtStudentReadInit = true;
                };

                // Need page to be there
                $timeout(function () {
                    init();
                });
            }
        ];
    }
);
