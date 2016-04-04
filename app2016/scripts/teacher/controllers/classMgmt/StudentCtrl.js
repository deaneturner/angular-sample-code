'use strict';
define([
        'scripts/common/configs/configApp'],
    function () {
        return ['$scope',
            'config',
            '$translate',
            'waitScreenSrv',
            '$timeout',
            '$state',
            function ($scope,
                      config,
                      $translate,
                      waitScreenSrv,
                      $timeout,
                      $state) {
                var model,
                    navigator;

                model = $scope.model = {};
                navigator = {};

                $scope.navigator = $scope.navigator || navigator;

                console.log('Entering Student Controller');

                model.studentInit = false;

                var init = function () {

                    model.studentInit = true;
                };

                // Need page to be there
                $timeout(function () {
                    init();
                });
            }];
    });
