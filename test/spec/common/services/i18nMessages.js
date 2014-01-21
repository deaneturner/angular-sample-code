'use strict';

describe('Common.Service: i18nMessages', function () {

    var $http,
        $httpBackend,
        $rootScope,
        $scope,
        i18nMessages;

    beforeEach(module('common.i18nMessages'));
    beforeEach(inject(function (_$http_, _$httpBackend_) {
        $http = _$http_;
        $httpBackend = _$httpBackend_;
    }));
    beforeEach(inject(function (_$rootScope_, _i18nMessages_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        i18nMessages = _i18nMessages_;
    }));

    it('should initialize properly', function () {

        //setup expected requests and responses
        $httpBackend
            .whenGET('locales/en.json')
            .respond({
                "en": "English",
                "es": "Spanish"
            });

        //invoke code under test
        i18nMessages.init('locales', 'en');

        //simulate response
        $httpBackend.flush();

        //verify key/value pairs have been retrieved and stored
        expect(i18nMessages.getLocalized().en).toEqual('English');
        expect(i18nMessages.getLocalized().es).toEqual('Spanish');

        //verify the user's language is stored on the root scope user object
        expect($rootScope.user.language).toEqual('en');
    });

    it('should set the language properly', function () {

        //setup expected requests and responses
        $httpBackend
            .whenGET('locales/en.json')
            .respond({
                "en": "English",
                "es": "Spanish"
            });

        $httpBackend
            .whenGET('locales/es.json')
            .respond({
                "en": "_es_English",
                "es": "_es_Spanish"
            });

        //initialize the service
        i18nMessages.init('locales', 'en');
        $httpBackend.flush();

        //invoke code under test
        i18nMessages.setLang('es');

        //simulate response
        $httpBackend.flush();

        //verify the user's language is stored on the root scope user object
        expect($rootScope.user.language).toEqual('es');
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});