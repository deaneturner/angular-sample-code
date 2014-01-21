'use strict';

describe('Common.Service: localizedMessages', function () {

    var $http,
        $httpBackend,
        $rootScope,
        $scope,
        i18nMessages,
        localizedMessages;

    beforeEach(module('common.localizedMessages'));
    beforeEach(inject(function (_$http_, _$httpBackend_) {
        $http = _$http_;
        $httpBackend = _$httpBackend_;
    }));
    beforeEach(inject(function (_$rootScope_, _i18nMessages_, _localizedMessages_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        i18nMessages = _i18nMessages_;
        localizedMessages = _localizedMessages_;
    }));

    it('should get a translation properly', function () {

        //setup expected requests and responses
        $httpBackend
            .whenGET('locales/en.json')
            .respond({
                "en": "English",
                "es": "Spanish {{param1}}"
            });

        //invoke code under test
        i18nMessages.init('locales', 'en');

        //simulate response
        $httpBackend.flush();

        //verify key/value pairs have been retrieved and stored
        expect(localizedMessages.get('en')).toEqual('English');
    });

    it('should get a translation with a param properly', function () {

        //setup expected requests and responses
        $httpBackend
            .whenGET('locales/en.json')
            .respond({
                "en": "English",
                "es": "Spanish {{param1}}"
            });

        //invoke code under test
        i18nMessages.init('locales', 'en');

        //simulate response
        $httpBackend.flush();

        //verify key/value pairs have been retrieved and stored
        expect(localizedMessages.get('es', {param1: "Language"})).toEqual('Spanish Language');
    });

    it('should get a translation without a param properly', function () {

        //setup expected requests and responses
        $httpBackend
            .whenGET('locales/en.json')
            .respond({
                "en": "English",
                "es": "Spanish {{param1}}"
            });

        //invoke code under test
        i18nMessages.init('locales', 'en');

        //simulate response
        $httpBackend.flush();

        //verify key/value pairs have been retrieved and stored
        expect(localizedMessages.get('es')).toEqual('Spanish ');
    });

    it('should handle a key not found properly', function () {

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
        expect(localizedMessages.get('_x_en')).toEqual('?_x_en?');
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});