/* globals sweetAlert, console, angular */
'use strict';
define([
        'scripts/common/configs/configApp',
        'scripts/teacher/services/classMgmt/studentSrv'],
    function () {
        return ['$rootScope', '$scope', 'config', 'studentSrv', '$timeout', '$translate', '$filter', 'waitScreenSrv', '$state', '$q',
            function ($rootScope, $scope, config, service, $timeout, $translate, $filter, waitScreenSrv, $state, $q) {
                var vm,
                    model,
                    updateScreenStatus,
                    resultSet,
                    displayMngr,
                    formMngr,
                    alertMngr,
                    messageMngr,
                    getObject,
                    setObject,
                    prepareModel;

                vm = this;

                model = $scope.model = {};
                $scope.navigator = $scope.navigator || {};

                updateScreenStatus = function () {
                    waitScreenSrv.toggleActivity(false, 'classMgmtStudentWrite-spinner');
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
                        console.log('StudentCreateCtrl:getStudent(' + id + ')');
                        waitScreenSrv.toggleActivity(true, 'classMgmtStudentWrite-spinner');

                        service.getStudentForId(id).then(function (response) {
                                $timeout(function () {
                                    $scope.resultSet.meta = response[0].meta;
                                    $timeout(function () {
                                        if ($scope.studentForm.identityForm) {
                                            $scope.resultSet.data = response[0].items[0] || {};
                                            formMngr.resetPasswordFieldPristine();
                                            formMngr.viewModel.load(response[0]);
                                        }
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
                    },
                    create: function (data) {
                        console.log('StudentCreateCtrl:create(' + JSON.stringify(data) + ')');
                        waitScreenSrv.toggleActivity(true, 'classMgmtStudentWrite-spinner');

                        return service.create(data).then();
                    }
                };

                displayMngr = {
                    mode: 'create',
                    currentForm: '',
                    contentBar: {
                        //search: {
                        //    placeholder: 'Search all Students',
                        //    onClick: function () {
                        //        return;
                        //    }
                        //},
                        //title: {
                        //    text: '',
                        //    onClick: function () {
                        //        return;
                        //    },
                        //},
                        //navButton: {
                        //    title: '< Back',
                        //    onClick: function () {
                        //        $state.classMgmt = {
                        //            state: 'teacherRoot.teachercontent.classMgmt',
                        //            params: {
                        //                className: $state.params.className,
                        //                class: $state.params.class,
                        //                school: $state.params.school
                        //            }
                        //        };
                        //
                        //        $state.go($state.classMgmt.state, $state.classMgmt.params);
                        //    }
                        //},
                        buttons: [{
                            title: 'Remove Student',
                            disabled: false,
                            onClick: function () {
                                return;
                            }
                        }],
                        breadcrumbs: {
                            separator: ' : ',
                            config: [
                            //    {
                            //    title: $state.studentCreate && $state.studentCreate.params.className,
                            //    onClick: function () {
                            //        $state.go($state.classMgmt.state, $state.studentCreate.params);
                            //    }
                            //},
                                {
                                title: $filter('translate')('classMgmt.student.content.new')
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
                            title: 'Save',
                            onClick: function () {
                                formMngr.submit();
                            }
                        }],
                        showValidSection: function (formName) {
                            var result,
                                form;

                            form = $scope.studentForm[formName];

                            if (Array.isArray(formName)) {
                                result = false;
                                angular.forEach(formName, function (form) {
                                    if ($scope.studentForm[form] && $scope.studentForm[form].$dirty && $scope.studentForm[form].$invalid) {
                                        result = true;
                                    }
                                });
                            }
                            else {
                                result = form && form.$dirty && form.$invalid;
                            }
                            return result;
                        }
                    },
                    goHome: function () {
                        alertMngr.enabled = false;
                        $state.go('teacherRoot.teachercontent.classMgmt.classRoster', $state.classMgmt.params);
                    },
                    init: function () {
                        var tabId,
                            selector;
                        // track tabs
                        $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
                            displayMngr.navigator.tabs.current = e.target.hash.slice(1);
                            displayMngr.navigator.tabs.previous = e.relatedTarget && e.relatedTarget.hash.slice(1);
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
                };

                formMngr = {
                    getListData: function (state) {
                        var deferred = $q.defer();

                        $q.all([
                            service.getStudentEnrollments('-1', $state.params.school)
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
                    ignoreTouched: false,
                    validations: {
                        text1: {
                            regex: '^[a-zA-Z0-9\\s\-\'\_\.]+$',
                            message: $filter('translate')('classMgmt.student.validations.text1')
                        },
                        text2: {
                            regex: '^[a-zA-Z0-9\\s\-\'\_]+$',
                            message: $filter('translate')('classMgmt.student.validations.text2')
                        },
                        digits3: {
                            regex: '^[0-9][0-9][0-9]$',
                            message: $filter('translate')('classMgmt.student.validations.digits', {value: 3})
                        },
                        digits4: {
                            regex: '^[0-9][0-9][0-9][0-9]$',
                            message: $filter('translate')('classMgmt.student.validations.digits', {value: 4})
                        },
                        digitsMin0Max10: {
                            regex: '^[0-9]{0,10}',
                            message: $filter('translate')('classMgmt.student.validations.digits', {min: 4, max: 10})
                        },
                        minlength: {
                            message: function (minLength) {
                                return $filter('translate')('classMgmt.student.validations.minLength', {value: minLength});
                            }
                        },
                        maxlength: {
                            message: function (maxLength) {
                                return $filter('translate')('classMgmt.student.validations.maxLength', {value: maxLength});
                            }
                        },
                        phoneNumber: {
                            message: $filter('translate')('classMgmt.student.validations.phoneNumber')
                        },
                        email: {
                            message: $filter('translate')('classMgmt.student.validations.email')
                        },
                        date: {
                            message: $filter('translate')('classMgmt.student.validations.date')
                        },
                        password: {
                            message: $filter('translate')('classMgmt.student.validations.password'),
                            confirmMsg: $filter('translate')('classMgmt.student.validations.passwordConfirm')
                        },
                        required: {
                            message: function (fieldNameLangKey) {
                                var fieldName;

                                fieldName = $filter('translate')(fieldNameLangKey);
                                return fieldName + $filter('translate')('classMgmt.student.validations.required');
                            }
                        }
                    },
                    isTouched: function (formField, ignoreTouched) {
                        var result;

                        if (ignoreTouched) {
                            result = false;
                        }
                        else {
                            result = formMngr.isTouchedOverride || formField.$touched;
                        }

                        return result;
                    },
                    submit: function () {
                        formMngr.ignoreTouched = true;
                        if ($scope.studentForm.$valid) {
                            resultSet.create(resultSet.data).then(function (response) {
                                displayMngr.goHome();
                            }, function (error) {
                                $translate('teacher.student.errors.createStudent').then(function (msg) {
                                    config.logger.error(msg, error);
                                });
                                updateScreenStatus();
                            });
                        }
                        else {
                            messageMngr.setMessages(['Error'], 'danger');
                        }
                    },
                    getCssClasses: function (formName, fieldNames, ignoreTouched) {
                        var result = [],
                            field;

                        if (Array.isArray(fieldNames)) {
                            angular.forEach(fieldNames, function (fieldName) {
                                field = $scope.studentForm[formName][fieldName];
                                if (field && field.$invalid && (field.$touched || ignoreTouched || formMngr.ignoreTouched)) {
                                    result[0] = 'has-error';
                                }
                            });
                        }
                        else {
                            field = $scope.studentForm[formName][fieldNames];
                            if (field && field.$invalid && (field.$touched || ignoreTouched || formMngr.ignoreTouched)) {
                                result.push('has-error');
                            }
                        }

                        return result;
                    },
                    labelDecorate: function (fieldName) {
                        var result,
                            requiredString = '*:',
                            isFieldConfig = fieldName && $scope.formMngr.fields[fieldName],
                            isRequired = isFieldConfig && $scope.formMngr.fields[fieldName].required;

                        if (isFieldConfig && isRequired) {
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

                        fieldDef = $scope.formMngr.fields[field];

                        result = (fieldDef ? fieldDef[value] : '');

                        return result;
                    },
                    resetPasswordFieldPristine: function () {
                        $scope.studentForm.identityForm.password.$setPristine();
                    },
                    fields: {
                        'grade': {
                            form: 'identityForm',
                            name: 'grade',
                            required: true
                        },
                        'sisId': {
                            form: 'identityForm',
                            name: 'sisId',
                            required: true,
                            maxlength: 32
                        },
                        'person.firstName': {
                            form: 'identityForm',
                            name: 'firstName',
                            required: true,
                            maxlength: 40
                        },
                        'person.middleName': {
                            maxlength: 2
                        },
                        'person.lastName': {
                            form: 'identityForm',
                            name: 'lastName',
                            required: true,
                            maxlength: 40
                        },
                        'person.suffix': {
                            maxlength: 2
                        },
                        'person.preferredName': {
                            maxlength: 101
                        },
                        'person.userName': {
                            form: 'identityForm',
                            name: 'userName',
                            required: true,
                            maxlength: 20
                        },
                        'person.password': {
                            form: 'identityForm',
                            name: 'password',
                            required: true,
                            minlength: 6,
                            maxlength: 16
                        },
                        'person.passwordConfirm': {
                            form: 'identityForm',
                            name: 'passwordConfirm',
                            required: true,
                            minlength: 6,
                            maxlength: 16,
                            value: ''
                        },
                        'person.dob': {
                            form: 'identityForm',
                            name: 'dob',
                            format: 'M/d/yyyy',
                            maxDate: new Date(),
                            dateOptions: {
                                formatYear: 'yy',
                                startingDay: 1
                            },
                            opened: false,
                            onClick: function () {
                                $scope.formMngr.fields['person.dob'].opened = true;
                            }
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
                        },
                        'listOfHmhGuardian[0].firstName': {
                            maxlength: 50
                        },
                        'listOfHmhGuardian[0].lastName': {
                            maxlength: 50
                        },
                        'listOfHmhGuardian[0].addressLine1': {
                            maxlength: 50
                        },
                        'listOfHmhGuardian[0].addressLine2': {
                            maxlength: 50
                        },
                        'listOfHmhGuardian[0].addressLine3': {
                            maxlength: 50
                        },
                        'listOfHmhGuardian[0].city': {
                            maxlength: 30
                        },
                        'listOfHmhGuardian[0].postalCode': {
                            maxlength: 10
                        },
                        'listOfHmhGuardian[0].stateProvince': {
                            maxlength: 2
                        },
                        'listOfHmhGuardian[1].firstName': {
                            maxlength: 50
                        },
                        'listOfHmhGuardian[1].lastName': {
                            maxlength: 50
                        },
                        'listOfHmhGuardian[1].city': {
                            maxlength: 30
                        },
                        'listOfHmhGuardian[1].stateProvince': {
                            maxlength: '2'
                        }
                    },
                    viewModel: {
                        'checkboxes': ['demographics.ayp', 'demographics.ethnicity', 'demographics.gender'],
                        'demographics.ayp': {},
                        'demographics.ethnicity': {},
                        'demographics.gender': {},
                        'getValueFromCheckboxSelection': function (fieldName) {
                            var result = [],
                                model = formMngr.viewModel[fieldName];
                            angular.forEach(Object.keys(model), function (key) {
                                if (model[key]) {
                                    result.push(key);
                                }
                            });

                            return result;
                        },
                        'updateCheckboxValue': function (fieldName, data, radioKey) {
                            var value,
                                vm;
                            value = radioKey || formMngr.viewModel.getValueFromCheckboxSelection(fieldName);

                            if (radioKey) {
                                // checkbox as radio
                                vm = formMngr.viewModel[fieldName];
                                angular.forEach(Object.keys(vm), function (key) {
                                    if (key === radioKey) {
                                        vm[key] = true;
                                    }
                                    else {
                                        vm[key] = false;
                                    }
                                });
                            }
                            setObject(fieldName, value, data);
                        },
                        'listOfHmhGuardian[0].contactInfo.phoneNumberList[0].number': {
                            areaCode: '',
                            exchange: '',
                            number: '',
                            setValue: function (value) {
                                resultSet.data.listOfHmhGuardian[0].contactInfor.phoneNumberList[0].number = value;
                            }
                        },
                        'listOfHmhGuardian[1].contactInfo.phoneNumberList[0].number': {
                            areaCode: '',
                            exchange: '',
                            number: '',
                            setValue: function (value) {
                                resultSet.data.listOfHmhGuardian[1].contactInfor.phoneNumberList[0].number = value;
                            }
                        },
                        updatePhoneNumber: function (field) {
                            var vm = formMngr.viewModel[field];
                            $timeout(function () {
                                vm.setValue(vm.areaCode + vm.exchange + vm.number);
                            });
                        },
                        isRequired: function (field, subField, subFields) {
                            var vm = formMngr.viewModel[field],
                                getOtherSubFields = function (notSubField) {
                                    var index;

                                    index = subFields.indexOf(notSubField);
                                    if (index > -1) {
                                        subFields.splice(index, 1);
                                    }
                                },
                                result = false;

                            angular.forEach(subFields, function (subField) {
                                if (vm[subField]) {
                                    result = true;
                                }
                            });

                            return result;
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
                                    number: data.items[0].listOfHmhGuardian[0].contactInfo.phoneNumberList[0].number.slice(6),
                                    setValue: function (value) {
                                        data.items[0].listOfHmhGuardian[0].contactInfo.phoneNumberList[0].number = value;
                                    }
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
                                    number: data.items[0].listOfHmhGuardian[1].contactInfo.phoneNumberList[0].number.slice(6),
                                    setValue: function (value) {
                                        data.items[0].listOfHmhGuardian[1].contactInfo.phoneNumberList[0].number = value;
                                    }
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

                alertMngr = {
                    enabled: false,
                    modalConfig: {
                        title: 'Continue wihout saving?',
                        text: 'You will loose your changes if you continue!',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Yes, continue without saving!',
                        closeOnConfirm: true
                    },
                    init: function () {
                        var preventDefault,
                            stateChangeStartHandler,
                            onStateChangeStart,
                            self = this;

                        function once(fn, context) {
                            var result;

                            return function () {
                                if (fn) {
                                    result = fn.apply(context || this, arguments);
                                    fn = null;
                                }

                                return result;
                            };
                        }

                        preventDefault = once(function (event) {
                            event.preventDefault();

                        });

                        // define handler for...
                        onStateChangeStart = function (event, toState, toParams, fromState, fromParams, options) {
                            if (self.enabled) {
                                try {
                                    preventDefault(event);
                                }
                                catch (e) {
                                    return;
                                }
                                sweetAlert(self.modalConfig,
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            $state.go(toState.name, toParams);
                                        } else {
                                            preventDefault = once(function (event) {
                                                event.preventDefault();

                                            });

                                            return;
                                        }
                                    }
                                );
                            }
                        };

                        // assign handler to ui-router listener
                        this.stateChangeStartHandler = $rootScope.$on('$stateChangeStart',
                            function (event, toState, toParams, fromState, fromParams, options) {
                                var action;
                                try {
                                    action = onStateChangeStart;
                                    action(event, toState, toParams, fromState, fromParams, options);
                                }
                                catch (e) {
                                    return;
                                }
                            });

                        // clean up on controller destroy
                        $scope.$on('$destroy', this.stateChangeStartHandler);

                        return this;
                    }
                };

                messageMngr = {
                    messages: [],
                    clearMessages: function () {
                        this.messages = [];
                    },
                    setMessages: function (messages, type) {
                        var result = [],
                            self = this;

                        self.type = type;

                        self.clearMessages();
                        angular.forEach(messages, function (message) {
                            self.messages.push(message);
                        });
                    },
                    getCssClasses: function () {
                        var self = this;

                        return ['alert', 'alert-' + self.type];
                    }
                };

                console.log('Entering Class Management - Student Update Controller');

                model.classMgmtStudentWriteInit = false;

                var init = function () {
                    $state.classMgmt = {
                        state: 'teacherRoot.teachercontent.classMgmt',
                        params: {
                            school: $state.params.school,
                            class: $state.params.class,
                            className: $state.params.className
                        }
                    };

                    if ($state.studentCreate && ($state.params.class !== $state.studentCreate.params.class)) {
                        /*
                         * Redirect back up to student list - User selects a new class context while on profile page.
                         */
                        $state.go($state.classMgmt.state, $state.classMgmt.params);
                    }

                    $scope.resultSet = resultSet;
                    $scope.displayMngr = displayMngr;
                    $scope.formMngr = formMngr;
                    $scope.messageMngr = messageMngr;
                    alertMngr.init();

                    vm.updateScreenStatus = updateScreenStatus;

                    $scope.resultSet.load('-1');

                    // tab does not render on initialize (css managment of rendering) unless initialization true is set
                    // here, instead of after some xhr response.
                    model.classMgmtStudentWriteInit = true;
                };

                // Need page to be there
                $timeout(function () {
                    init();
                });
            }
        ];
    });
