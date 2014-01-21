'use strict';

var $http,
    $httpBackend,
    $rootScope,
    $scope,
    exceptionHandler,
    i18nNotifications,
    provide;

describe('ExceptionHandler handling of fatal XHR responses - option: pushForCurrentRoute', function () {
    beforeEach(module('ccApp', function($provide) {
        $provide.value('i18nNotificationSettings', {
            fatal: 'pushForCurrentRoute',
            nonFatal: 'notify',
            routeChange: 'pushForCurrentRoute'
        });
    }));

    beforeEach(inject(function (_$rootScope_,_$http_, _$httpBackend_, _i18nNotifications_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $http = _$http_;
        $httpBackend = _$httpBackend_;
        i18nNotifications = _i18nNotifications_;
    }));

    it('should add notifications for a server 401 error - when configured to pushForCurrentRoute', function () {

        $httpBackend
            .whenGET('locales/en.json')
            .respond({});  // test is not picking up on locales file!?

        $httpBackend
            .whenGET('userinfo')
            .respond(401);


        //simulate response
        $httpBackend.flush();

        expect(i18nNotifications.getCurrent().length).toEqual(1);
        expect(i18nNotifications.getCurrent()[0].type).toEqual('error');
        expect(i18nNotifications.getCurrent()[0].message).toEqual("?errors.authentication?");  // test is not picking up on locales file!?

    });

    it('should add notifications for a server 403 error - when configured to pushForCurrentRoute', function () {

        $httpBackend
            .whenGET('locales/en.json')
            .respond({});  // test is not picking up on locales file!?

        $httpBackend
            .whenGET('userinfo')
            .respond(403);


        //simulate response
        $httpBackend.flush();

        expect(i18nNotifications.getCurrent().length).toEqual(1);
        expect(i18nNotifications.getCurrent()[0].type).toEqual('error');
        expect(i18nNotifications.getCurrent()[0].message).toEqual("?errors.authentication?");  // test is not picking up on locales file!?

    });

    it('should add notifications for a server 500 error - when configured to pushForCurrentRoute', function () {

        $httpBackend
            .whenGET('locales/en.json')
            .respond({});  // test is not picking up on locales file!?

        $httpBackend
            .whenGET('userinfo')
            .respond(500);


        //simulate response
        $httpBackend.flush();

        expect(i18nNotifications.getCurrent().length).toEqual(1);
        expect(i18nNotifications.getCurrent()[0].type).toEqual('error');
        expect(i18nNotifications.getCurrent()[0].message).toEqual("?errors.server?");  // test is not picking up on locales file!?

    });

    it('should add notifications for a server default error - when configured to pushForCurrentRoute', function () {

        $httpBackend
            .whenGET('locales/en.json')
            .respond({});  // test is not picking up on locales file!?

        $httpBackend
            .whenGET('userinfo')
            .respond(404);


        //simulate response
        $httpBackend.flush();

        expect(i18nNotifications.getCurrent().length).toEqual(1);
        expect(i18nNotifications.getCurrent()[0].type).toEqual('error');
        expect(i18nNotifications.getCurrent()[0].message).toEqual("?errors.server.general?");  // test is not picking up on locales file!?

    });
});

describe('ExceptionHandler handling of fatal XHR responses - option: notify', function () {
    beforeEach(module('ccApp', function($provide) {
        $provide.value('i18nNotificationSettings', {
            fatal: 'notify',
            nonFatal: 'notify',
            routeChange: 'pushForCurrentRoute'
        });
    }));

    beforeEach(inject(function (_$rootScope_,_$http_, _$httpBackend_, _i18nNotifications_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $http = _$http_;
        $httpBackend = _$httpBackend_;
        i18nNotifications = _i18nNotifications_;

        i18nNotifications.setDelegate({
            config: (function () {
                toastr.options.closeButton = true;
                toastr.options.fadeOut = 10000;
            })(),
            notify: function (value) {
                //toastr[value.type](value.message);
            }
        });
    }));

    it('should add notifications for a server 401 error - when configured to notify', function () {

        $httpBackend
            .whenGET('locales/en.json')
            .respond({});  // test is not picking up on locales file!?

        $httpBackend
            .whenGET('userinfo')
            .respond(401);


        //simulate response
        $httpBackend.flush();

        expect(i18nNotifications.getCurrent().length).toEqual(0);

    });

    it('should add notifications for a server 403 error - when configured to notify', function () {

        $httpBackend
            .whenGET('locales/en.json')
            .respond({});  // test is not picking up on locales file!?

        $httpBackend
            .whenGET('userinfo')
            .respond(403);


        //simulate response
        $httpBackend.flush();

        expect(i18nNotifications.getCurrent().length).toEqual(0);

    });

    it('should add notifications for a server 500 error - when configured to notify', function () {

        $httpBackend
            .whenGET('locales/en.json')
            .respond({});  // test is not picking up on locales file!?

        $httpBackend
            .whenGET('userinfo')
            .respond(500);


        //simulate response
        $httpBackend.flush();

        expect(i18nNotifications.getCurrent().length).toEqual(0);

    });

    it('should add notifications for a server default error - when configured to notify', function () {

        $httpBackend
            .whenGET('locales/en.json')
            .respond({});  // test is not picking up on locales file!?

        $httpBackend
            .whenGET('userinfo')
            .respond(404);


        //simulate response
        $httpBackend.flush();

        expect(i18nNotifications.getCurrent().length).toEqual(0);

    });
});

describe('ExceptionHandler handling of non-fatal XHR responses - option: pushForCurrentRoute', function () {
    beforeEach(module('ccApp', function($provide) {
        $provide.value('i18nNotificationSettings', {
            fatal: 'pushForCurrentRoute',
            nonFatal: 'pushForCurrentRoute',
            routeChange: 'pushForCurrentRoute'
        });
    }));

    beforeEach(inject(function (_$rootScope_,_$http_, _$httpBackend_, _i18nNotifications_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $http = _$http_;
        $httpBackend = _$httpBackend_;
        i18nNotifications = _i18nNotifications_;
    }));

    it('should add notifications for a single error object - when configured to pushForCurrentRoute', function () {

        $httpBackend
            .whenGET('locales/en.json')
            .respond({});  // test is not picking up on locales file!?

        $httpBackend
            .whenGET('userinfo')
            .respond({"errors": {"msgKey":"schedule.errors.carrierlist.is.incomplete"},"user_message":"","username":"ccdev","error_message":"","calling_class":"com.fwdco.webservice.ScorpeoWebService","method_name":"WSP.CC.GET.FILE.LIST","error_code":"0","file_list":[["job_name","description"],["MetlifeCensus","Met Life Census"],["Principal401k","Principal 401 K"],["DeltaDental834","Delta Dental 834"],["HumanaBenefits","Humana Benefits"],["BlueCrossBlueShield834","Blue Cross"]]});


        //simulate response
        $httpBackend.flush();

        expect(i18nNotifications.getCurrent().length).toEqual(1);
        expect(i18nNotifications.getCurrent()[0].type).toEqual('warning');
        expect(i18nNotifications.getCurrent()[0].message).toEqual("?schedule.errors.carrierlist.is.incomplete?");  // test is not picking up on locales file!?

    });

    it('should add notifications for multiple error objects - when configured to pushForCurrentRoute', function () {

        $httpBackend
            .whenGET('locales/en.json')
            .respond({});  // test is not picking up on locales file!?

        $httpBackend
            .whenGET('userinfo')
            .respond({"errors": [{"msgKey":"schedule.errors.carrierlist.is.incomplete"},{"msgKey":"schedule.errors.carrierlist.wrong.company"}],"user_message":"","username":"ccdev","error_message":"","calling_class":"com.fwdco.webservice.ScorpeoWebService","method_name":"WSP.CC.GET.FILE.LIST","error_code":"0","file_list":[["job_name","description"],["MetlifeCensus","Met Life Census"],["Principal401k","Principal 401 K"],["DeltaDental834","Delta Dental 834"],["HumanaBenefits","Humana Benefits"],["BlueCrossBlueShield834","Blue Cross"]]});


        //simulate response
        $httpBackend.flush();

        expect(i18nNotifications.getCurrent().length).toEqual(2);
        expect(i18nNotifications.getCurrent()[0].type).toEqual('warning');
        expect(i18nNotifications.getCurrent()[0].message).toEqual("?schedule.errors.carrierlist.is.incomplete?");  // test is not picking up on locales file!?

    });
});