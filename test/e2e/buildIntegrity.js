'user strict';

describe('root page loads without exception', function() {

    it('should should automatically redirect to /dashboard and not have any exceptions that prevent the DOM from rendering', function () {
        browser.get('/ccii');
        element(by.css('h2')).getText().then(function(firstHeaderText) {
            expect(firstHeaderText).toEqual('Dashboard');
        });
    });

});