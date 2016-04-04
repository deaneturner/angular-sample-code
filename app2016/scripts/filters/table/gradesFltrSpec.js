'use strict';

define([
        'angular',
        'angular-mocks',
        'scripts/filters/filtersApp'
    ],
    function (a, b, c) {
        describe('Filter: Grades', function () {

            beforeEach(angular.mock.module('filtersApp', function ($provide) {
                $provide.value('$state', {
                    go: function () {
                    }
                });
            }));

            it('should be defined', inject(function ($filter) {
                expect($filter('grades')).toBeDefined();
            }));

            it('should apply the grades filter', inject(function ($filter) {
                expect($filter('grades')([1, 2])).toEqual('1 - 2');
            }));
        });
    });
