'use strict';

define([
        'angular',
        'angular-mocks',
        'scripts/filters/filtersApp'
    ],
    function (a, b, c) {
        describe('Filter: Array', function () {

            beforeEach(angular.mock.module('filtersApp', function ($provide) {
                $provide.value('$state', {
                    go: function () {
                    }
                });
            }));

            it('should be defined', inject(function ($filter) {
                expect($filter('array')).toBeDefined();
            }));

            it('should convert an array to a comma delimited string', inject(function ($filter) {
                expect($filter('array')([1, 2, 3])).toEqual('1, 2, 3');
            }));

            it('should not convert anything other than an array - return input', inject(function ($filter) {
                expect($filter('array')('1, 2, 3')).toEqual('1, 2, 3');
            }));
        });
    });
