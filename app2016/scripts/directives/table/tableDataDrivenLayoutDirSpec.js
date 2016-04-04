'use strict';

define([
        'angular',
        'angular-mocks',
        'scripts/directives/directivesApp',
        'scripts/filters/filtersApp',
        'scripts/directives/templates/table.html'
    ],
    function (a, b, c, d) {
        describe('Directive: Table Data Driven Layout', function () {
            var scope,
                serviceDefer,
                $q,
                getCellClasses = function (config) {
                    var result = [];

                    if (config.onCellClick) {
                        result.push('table-cell-action');
                    }

                    return result;
                },
                setSelected = function (items, state) {
                    // set the record selected state
                    angular.forEach(items, function (item) {
                        item.selected = state;
                    });

                    return items;
                },
                getSelected = function (items) {
                    var result = [];

                    angular.forEach(items, function (item) {
                        if (item.selected) {
                            result.push(item);
                        }

                    });

                    return result;
                },
                configMock = {
                    logger: {
                        options: '',
                        error: function (args) {
                        }
                    },
                    userACL: {
                        Id: 'aaa'
                    },
                    keepAliveTimeout: 20,
                    keepAliveWaitTimeout: 8,
                    keepAliveMembers: {},
                    urlList: 'TE, SRI, IR, LTI, ILT, LRS, R180U, LOGOUT, KEEPALIVE',
                    urls: {},
                    pageSizeOptions: {
                        small: {
                            pageSize: 5,
                            pageSizes: [1, 5, 10, 25, 50]
                        },
                        large: {
                            pageSize: 100,
                            pageSizes: [5, 10, 25, 50, 100]
                        }
                    }
                },
                serviceMock = {
                    getResourceCollectionTiers: function () {
                        serviceDefer = $q.defer();
                        return serviceDefer.promise;
                    },
                    getResourceCollections: function (pagination) {
                        serviceDefer = $q.defer();
                        return serviceDefer.promise;
                    }
                },
                tstCtrl,
                $translate,
                $timeout,
                $httpBackend,
                element,
                template,
                controller,
                isolateScope,
                tableDef = {
                    columns: [
                        {
                            title: 'NAME',              // title in header cells
                            fieldName: 'name',          // field name found in data object array
                            sortable: true,
                            onCellClick: function (selectKey, fieldName, selectVal) {
                                alert('Someday I am going to do something!\n\n' + selectKey +
                                    '\n' + fieldName + '\n' + selectVal);
                            },
                            filter: 'text'
                        },
                        {
                            title: 'TYPE',
                            fieldName: 'type',
                            filter: 'array'

                        },
                        {
                            title: 'GRADE',
                            fieldName: 'grade',
                            filter: 'grades'
                        },
                        {
                            title: 'CLASSES',
                            fieldName: 'classes',
                            onCellClick: function (selectKey, fieldName, selectVal) {
                                alert('Someday I am going to do something!\n\n' + selectKey +
                                    '\n' + fieldName + '\n' + selectVal);
                            },
                            filter: 'number : 0'
                        },
                        {
                            title: 'TEACHERS',
                            fieldName: 'teachers',
                            onCellClick: function (selectKey, fieldName, selectVal) {
                                alert('Someday I am going to do something!\n\n' + selectKey +
                                    '\n' + fieldName + '\n' + selectVal);
                            },
                            filter: 'number : 0'
                        },
                        {
                            title: 'STUDENTS',
                            fieldName: 'students',
                            onCellClick: function (selectKey, fieldName, selectVal) {
                                alert('Someday I am going to do something!\n\n' + selectKey +
                                    '\n' + fieldName + '\n' + selectVal);
                            },
                            filter: 'number : 0'
                        }
                    ],
                    sort: {
                        column: 'name', // field name of sorted column
                        descending: false
                    },
                    selectKey: 'systemId',  // key passed to click event handler, when selecting a row cell
                    msgEmptyResultset: '0 records found',
                    init: function () {
                        var tableDef = this;
                        tableDef.fieldNames = [];

                        angular.forEach(tableDef.columns, function (column) {
                            // collect and store an array of field names (used in constructing table cols against model)
                            tableDef.fieldNames.push(column.fieldName);

                            // apply methods
                            angular.extend(column, {
                                getCellClasses: getCellClasses
                            });
                        });

                        return tableDef;
                    }
                },
                resultSet = {
                    currentPage: 0,
                    pageSize: configMock.pageSizeOptions.small.pageSize,
                    remote: true,
                    pageSizes: configMock.pageSizeOptions.small.pageSizes,
                    start: 0,
                    total: 0,
                    sortBy: tableDef.sort.column || '',
                    sortDescending: !!tableDef.sort.descending,
                    data: [],
                    selectionModel: {
                        allSelected: false,
                        selectionSize: 0,
                        getSelectionSize: function () {
                            return getSelected(scope.resultSet.data).length;
                        },
                        toggleSelected: function () {
                            // allSelected value is being toggled at the control level
                            setSelected(resultSet.data, this.allSelected);
                            this.selectionSize = this.getSelectionSize();
                        },
                        setSelectionSize: function (size) {
                            // track
                            this.selectionSize = size;
                            // update model
                            setSelected(resultSet.data, true);
                            // update control
                            this.allSelected = true;
                        },
                        onRowSelect: function () {
                            if (this.allSelected) {
                                // unselected checkbox in row so, update header checkbox to unchecked
                                this.allSelected = false;
                                this.selectionSize = this.getSelectionSize();
                            }
                            else if (this.getSelectionSize() === resultSet.data.length) {
                                // number of items selected is same as all selected
                                this.allSelected = true;
                                this.selectedSize = resultSet.data.length;
                            }
                            else {
                                this.selectionSize = this.getSelectionSize();
                            }
                        }
                    },
                    load: function (paramObj) {
                        return [];
                    }
                },
                handlers = {
                    onCellClick: function (selectKey, fieldName, selectVal) {
                        var columns = tableDef.columns;
                        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
                            if (columns[colIndex].fieldName === fieldName) {
                                // found the column - execute the specific onCellClick handler
                                if (columns[colIndex].onCellClick) {
                                    columns[colIndex].onCellClick(selectKey, fieldName, selectVal);
                                }
                                break;
                            }
                        }
                    },
                    onWatchGroup: function (newVal, oldVal) {
                        // resultSetselectionModel.selectionSize
                        if (newVal[0] !== oldVal[0]) {
                            scope.controls.bulkAction.isDisabled = (newVal < 2);
                        }
                    }
                },
                controls = {
                    bulkAction: {
                        isDisabled: true
                    }
                },
                stateMock = {
                    go: function () {
                    }
                };

            beforeEach(angular.mock.module('directivesApp', function ($provide) {
                $provide.value('config', configMock);
                $provide.value('$state', stateMock);
            }));

            beforeEach(angular.mock.module('filtersApp', function () { }));

            beforeEach(module('scripts/directives/templates/table.html'));

            beforeEach(angular.mock.inject(
                function ($rootScope, $compile, $injector, _$timeout_, _$httpBackend_) {
                    scope = $rootScope.$new();
                    scope.tableDef = tableDef;
                    scope.resultSet = resultSet;
                    scope.handlers = handlers;
                    $q = $injector.get('$q');
                    $timeout = _$timeout_;
                    $httpBackend = _$httpBackend_;

                    scope.controls = controls;
                    tableDef.init();

                    element = angular.element('<table-data-driven-layout ' +
                        'table-def="tableDef" ' +
                        'result-set="resultSet" ' +
                        'handlers="handlers" ' +
                        'template-url="scripts/directives/templates/table.html">' +
                        '</table-data-driven-layout>');

                    $httpBackend.whenGET().respond(200);

                    template = $compile(element)(scope);

                    scope.$apply();

                    controller = template.controller(scope);

                    isolateScope = controller.isolateScope();

                }));

            it('should have its template defined', function () {
                expect(template).toBeDefined();
            });

            it('should have its DOM element defined', function () {
                expect(element).toEqual(jasmine.any(Object));
            });

            it('should have its controller defined', function () {
                expect(element.controller(scope)).toBeDefined();
            });

            it('should recalculate number of pages, for a new resultSet total', function () {
                scope.resultSet.total = 21;
                scope.$apply();
                expect(scope.resultSet.numberOfPages).toEqual(5);
            });

            it('should synchronize current page on result set current page change', function () {
                spyOn(scope.handlers, 'changePage');
                scope.resultSet.total = 21;
                scope.resultSet.currentPage = 1;
                scope.$apply();
                expect(scope.handlers.changePage).toHaveBeenCalled();
            });

            it('should load data on page size change', function () {
                spyOn(scope.resultSet, 'load');
                scope.handlers.changePageSize(5);
                scope.$apply();
                expect(scope.resultSet.load).toHaveBeenCalled();
            });

            it('should load data on page change', function () {
                spyOn(scope.resultSet, 'load');
                scope.handlers.changePage(1);
                scope.$apply();
                expect(scope.resultSet.load).toHaveBeenCalled();
            });

            it('should get a column filter from the table definition', function () {
                expect(isolateScope.getColumnFilter('type')).toEqual('array');
            });

            it('should get the cell classes for the column', function () {
                expect(isolateScope.getCellClasses('type')).toEqual([]);
            });

            it('should load data on sort direction change', function () {
                var previousSortDescending = angular.copy(scope.resultSet.sortDescending);
                spyOn(scope.resultSet, 'load');
                scope.handlers.changeSorting('name');
                scope.$apply();
                expect(scope.resultSet.sortDescending).toEqual(!previousSortDescending);
                expect(scope.resultSet.load).toHaveBeenCalled();
            });
        });
    });
