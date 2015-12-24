describe("URLService", function() {
    var URLService;

    beforeEach(function() {
        module("OpenAQClient");
        inject(function(_URLService_) {
            URLService = _URLService_;
        });
    });

    it("should have a getOpenAQUrl function", function() {
        expect(angular.isFunction(URLService.getOpenAQUrl)).toBe(true);
    });

    describe("getOpenAQUrl", function() {
        it("should throw when no argument provided", function() {
            expect(URLService.getOpenAQUrl)
                .toThrowError("API endpoint required.");
        });

        it("should throw on invalid argument", function() {
            expect(function(){ URLService.getOpenAQUrl("blahblah") })
                .toThrowError("API endpoint unavailable.");
        });

        it("should return API endpoint address", function() {
            expect(URLService.getOpenAQUrl("cities"))
                .toEqual("https://api.openaq.org/v1/cities");
            expect(URLService.getOpenAQUrl("countries"))
                .toEqual("https://api.openaq.org/v1/countries");
            expect(URLService.getOpenAQUrl("latest"))
                .toEqual("https://api.openaq.org/v1/latest");
            expect(URLService.getOpenAQUrl("locations"))
                .toEqual("https://api.openaq.org/v1/locations");
            expect(URLService.getOpenAQUrl("measurements"))
                .toEqual("https://api.openaq.org/v1/measurements");
        });
    });
});
