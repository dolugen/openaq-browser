describe("storageService", function() {
    beforeEach("app.core");
    var storageService;

    beforeEach(inject(function(_storageService_) {
        storageService = _storageService_;
    }));

    it("should provide a get function", function() {
        expect(angular.isFunction(storageService.get)).toBe(true);
    });
});
