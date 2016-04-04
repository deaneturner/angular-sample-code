'use strict';

/**
 * @ngdoc tableDataDrivenLayout
 * @name global.directive:nameOfDirective
 * @$scope
 * @restrict E
 *
 * @description
 * This directive generates a table, using a object-literal configuration.  It supports static and remote data sets.
 *
 * Features:
 *      Paging
 *      Sorting (single column)
 *      Cell-click handling.
 *
 * Local mode operates against a single static data set.  (Note: this mode has not been fully tested.)
 *
 * For remote data pagination and sorting, set the resultSet object-literal property "remote" to true.
 *
 *   <table-data-driven-layout
 *      table-def="tableDef"
 *      result-set="resultSet"
 *      on-cell-click="onCellClick"
 *      template-url="scripts/techadmin/templates/navigationBar/table.html">
 *   </table-data-driven-layout>
 *
 * @param {object}  tableDef   Passed as parameter from a controller's scope
 *
 *      {
 *          columns: [{
 *              title: 'NAME',              // title in header cells
 *              fieldName: 'name',          // field name found in data object array
 *              sortable: true,             // true - will process a click event for a remote data sort
 *              onCellClick: function(selectKey, fieldName, selectVal) {...},   // !!! use a single controller method
 *                                                                              // that references the object instance
 *                                                                              // property (avoid instance for each cell!)
 *              filter: 'text'
 *          },
 *          {
 *              title: 'CLASSES',
 *              fieldName: 'classes',
 *              onCellClick: function(selectKey, fieldName, selectVal) {...},
 *              filter: 'number : 0'
 *           }],
 *          sort: {
 *              column: 'type',             // field name of sorted column
 *              descending: false
 *          },
 *          selectKey: 'id',  // key passed to click event handler, when selecting a row cell
 *          msgEmptyResultset: '0 records found'
 *      };
 *
 * @param {object}  resultSet   Passed as parameter from controller scope
 *
 *      $scope.resultSet = {
 *          currentPage: 0,                 // configurable parameter on load - dynamically sets table state
 *          pageSize: 5,                    // configurable parameter on load - dynamically sets table state
 *          remote: true,                   // configurable parameter on load - dynamically sets table state
 *          pageSizes: [1, 5, 10, 25, 50],  // options for page sizes
 *          start: 0,                       // initialize start record
 *          total: 0,                       // initialize total number of records
 *          sortBy: $scope.tableDef.sort.column || '',
 *          sortDescending: !!$scope.tableDef.sort.descending,
 *          data: [],                       // initialize data array
 *          load: function (paramObj) {...} // pass a single parameter (change page for example) or a complete
 *                                          // parameter object to set state
 *                                          // {
 *                                          //        currentPage: resultSet.currentPage,
 *                                          //        pageSize: resultSet.pageSize,
 *                                          //        sortBy: resultSet.sortBy,
 *                                          //        sortDescending: resultSet.sortDescending
 *                                          //  }
 *
 *  @param {object}  handlers   Passed as parameter from controller scope
 *
 *      The handlers to expose to parent scope.  The onCellClick handler finds and executes the appropriate handler,
 *      via the table definition's column, object-literal property "onCellClick".  This approach avoids loading a
 *      new onCellClick function on every cell, which wouild be a performance and resource issue.
 *
 * @param {object}  template-url   Passed as parameter from controller scope
 *
 *      See the sample tableTemplate accompanying this directive in the same folder.  It is an integral part of using this
 *      directive.
 *
 */
define(function () {
    return function (app) {
        app.register.directive('tableDataDrivenLayout', function () {
                return {
                    restrict: 'E',
                    transclude: true,
                    templateUrl: function (elem, attrs) {
                        return attrs.templateUrl;
                    },
                    scope: {
                        tableDef: '=',
                        resultSet: '=',
                        handlers: '='
                    },
                    controller: function ($scope) {
                        var getColumnFilter = function (columnName) {
                                for (var i = 0; i < $scope.columns.length; i++) {
                                    if (columnName === $scope.columns[i].fieldName) {
                                        return $scope.columns[i].filter;
                                    }
                                }
                                return '';
                            },
                            getCellClasses = function (fieldName) {
                                var result = [],
                                    columns = $scope.tableDef.columns;

                                for (var colIndex = 0; colIndex < columns.length; colIndex++) {
                                    if (columns[colIndex].fieldName === fieldName) {
                                        // found the column - return the classes
                                        if (columns[colIndex].getCellClasses) {
                                            result = columns[colIndex].getCellClasses(columns[colIndex]);
                                        }
                                        break;
                                    }
                                }

                                return result;
                            },
                            changeSorting = function (columnName) {
                                var resultSet = $scope.resultSet;
                                if (resultSet.sortBy === columnName) {
                                    resultSet.sortDescending = !resultSet.sortDescending;
                                } else {
                                    resultSet.sortBy = columnName;
                                    resultSet.sortDescending = false;
                                }

                                /*
                                 * ChangeSorting needs to work in local and remote modes, thus no object param passed to load().
                                 * Otherwise, use a param object to overwrite the resultSet params to desired values.
                                 */
                                if ($scope.resultSet.remote) {
                                    // changeSorting needs to work in local and remote modes, thus no object param passed to load
                                    $scope.resultSet.load();
                                }
                            },
                            selectedClass = function (columnName) {
                                return columnName === $scope.resultSet.sortBy ? 'active-sort' : '';
                            },
                            changePageSize = function (_newSize_) {
                                var currentPage = 0,
                                    newSize = parseInt(_newSize_);

                                // Recalculate number of pages
                                $scope.resultSet.numberOfPages = Math.ceil($scope.resultSet.total / newSize) || 1;

                                // Adjust current page to max if necessary
                                if ($scope.resultSet.currentPage >= $scope.resultSet.numberOfPages) {
                                    currentPage = $scope.resultSet.numberOfPages - 1;
                                }

                                // Load using new param set
                                // - avoid affecting watch (i.e. setting resultSet.params)
                                // by cloning and using a separate param object.
                                $scope.resultSet.load({
                                    currentPage: currentPage,
                                    pageSize: newSize
                                });
                            },
                            changePage = function (page, omitLoad) {
                                // set current page
                                // - avoid affecting watch (i.e. setting resultSet.params)
                                // by cloning and using a separate param object.
                                var paramObj = angular.copy($scope.resultSet);
                                angular.extend(paramObj, {
                                    currentPage: page,
                                    start: $scope.resultSet.remote ? 0 : (page * $scope.resultSet.pageSize)
                                });

                                /*
                                 * Send a request for the next page of data to the parent controller
                                 */
                                if (!omitLoad && $scope.resultSet.remote) {
                                    $scope.resultSet.load(paramObj);
                                }
                            };

                        // columns
                        $scope.columns = $scope.tableDef.columns;
                        //  column filter - from table def
                        $scope.getColumnFilter = getColumnFilter;
                        // column cell classes - from table def
                        $scope.getCellClasses = getCellClasses;

                        // sorting
                        $scope.selectedClass = selectedClass;
                        $scope.handlers.changeSorting = changeSorting;

                        /*
                         * Pagination
                         */
                        // Assert config params
                        if (!$scope.resultSet.pageSizes) {
                            $scope.resultSet.pageSizes = [1, 5, 10, 25, 50];
                        }
                        if (!$scope.resultSet.pageSize) {
                            $scope.resultSet.pageSize = 5;
                        }
                        if (!$scope.resultSet.currentPage) {
                            $scope.resultSet.currentPage = 0;
                        }

                        // change page size
                        $scope.handlers.changePageSize = changePageSize;

                        // next, previous, jump-to - page navigation
                        $scope.handlers.changePage = changePage;

                        // watch parent controller for result set parameter changes
                        $scope.$watchGroup(['resultSet.total',
                                'resultSet.currentPage'],
                            function (newVal, oldVal) {
                                var resultSet = $scope.resultSet,
                                    toRecord = resultSet.pageSize * (resultSet.currentPage + 1);
                                // Sync current page from parent controller
                                if (newVal[1] !== oldVal[1]) {
                                    $scope.handlers.changePage(resultSet.currentPage, true);
                                }

                                // Recalculate number of pages
                                resultSet.numberOfPages = Math.ceil(resultSet.total / resultSet.pageSize) || 1;

                                // If page doesn't exist set to last page
                                if (resultSet.currentPage >= resultSet.numberOfPages) {
                                    $scope.handlers.changePage(resultSet.numberOfPages - 1, true);
                                }

                                // Recalculate record n - N of Total
                                if (resultSet.numberOfPages === 1) {
                                    if (resultSet.total === 0) {
                                        resultSet.fromRecord = '';
                                        resultSet.toRecord = 0;
                                    }
                                    else {
                                        resultSet.fromRecord = '';
                                        resultSet.toRecord = resultSet.total;
                                    }

                                }
                                else {
                                    resultSet.fromRecord = toRecord - (resultSet.pageSize - 1);
                                    resultSet.toRecord = toRecord;
                                }

                            }, true);
                    }
                };
            }
        );
    };
});
