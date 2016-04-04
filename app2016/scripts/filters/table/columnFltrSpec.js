'use strict';

define([
        'angular',
        'angular-mocks',
        'scripts/filters/filtersApp'
    ],
    function (a, b, c) {
        describe('Filter: Column', function () {

            beforeEach(angular.mock.module('filtersApp', function ($provide) {
                $provide.value('$state', {
                    go: function () {
                    }
                });
            }));

            it('should be defined', inject(function ($filter) {
                expect($filter('column')).toBeDefined();
            }));

            it('should apply the text filter', inject(function ($filter) {
                expect($filter('column')('1, 2, 3', 'text')).toEqual('1, 2, 3');
            }));

            it('should apply the number filter', inject(function ($filter) {
                expect($filter('column')('1234.000', 'number')).toEqual('1,234.00');
            }));

            it('should apply the percentage filter', inject(function ($filter) {
                expect($filter('column')('123', 'percentage')).toEqual('123.00%');
            }));

            it('should apply the dateTime filter', inject(function ($filter) {
                expect($filter('column')(new Date('1/1/2016'), 'dateTime')).toEqual('Jan 1, 2016 12:00:00 AM');
            }));

            it('should apply the grades filter', inject(function ($filter) {
                expect($filter('column')([1, 2], 'grades')).toEqual('1 - 2');
            }));

            it('should apply the array filter', inject(function ($filter) {
                expect($filter('column')([1, 2, 3], 'array')).toEqual('1, 2, 3');
            }));

            it('should pass thru number:? filters', inject(function ($filter) {
                expect($filter('column')(123.00, 'number: 0')).toEqual('123');
            }));
        });
    });
