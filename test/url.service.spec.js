describe("URLService", function() {
    var URLService;

    beforeEach(function() {
        module("app.core");
        inject(function(_URLService_) {
            URLService = _URLService_;
        });
    });

    it("should have a getUrl function", function() {
        expect(angular.isFunction(URLService.getUrl)).toBe(true);
    });

    describe("getUrl", function() {
        it("should throw when no argument provided", function() {
            expect(URLService.getUrl)
                .toThrowError("API endpoint required.");
        });

        it("should throw on invalid argument", function() {
            expect(function(){ URLService.getUrl("blahblah") })
                .toThrowError("API endpoint unavailable.");
        });

        it("should return API endpoint address", function() {
            expect(URLService.getUrl("cities"))
                .toEqual("https://api.openaq.org/v1/cities");
            expect(URLService.getUrl("countries"))
                .toEqual("https://api.openaq.org/v1/countries");
            expect(URLService.getUrl("latest"))
                .toEqual("https://api.openaq.org/v1/latest");
            expect(URLService.getUrl("locations"))
                .toEqual("https://api.openaq.org/v1/locations");
            expect(URLService.getUrl("measurements"))
                .toEqual("https://api.openaq.org/v1/measurements");
            expect(URLService.getUrl("parameters"))
                .toEqual("https://api.openaq.org/v1/parameters");
        });
    });
});
