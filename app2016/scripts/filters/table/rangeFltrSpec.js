'use strict';

define([
        'angular',
        'angular-mocks',
        'scripts/filters/filtersApp'
    ],
    function (a, b, c) {
        describe('Filter: Range', function () {

            beforeEach(angular.mock.module('filtersApp', function ($provide) {
                $provide.value('$state', {
                    go: function () {
                    }
                });
            }));

            it('should be defined', inject(function ($filter) {
                expect($filter('range')).toBeDefined();
            }));

            it('should apply the range filter', inject(function ($filter) {
                expect($filter('range')([], '1', '2')).toEqual([1]);
            }));
        });
    });
