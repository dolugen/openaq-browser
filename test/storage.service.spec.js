describe("storageService", function() {
    beforeEach(module("app.core"));
    var storageService;

    beforeEach(inject(function(_storageService_) {
        storageService = _storageService_;
    }));

    it("should provide a get function", function() {
        expect(angular.isFunction(storageService.get)).toBe(true);
    });

    it("should provide a set function", function() {
        expect(angular.isFunction(storageService.set)).toBe(true);
    });

    it("should provide a remove function", function() {
        expect(angular.isFunction(storageService.remove)).toBe(true);
    });

    describe("storageService.set", function() {
        it("should store data for retrieval", function() {
            storageService.set("title", "Moby Dick");
            expect(storageService.get("title")).toEqual("Moby Dick");
        });

        it("should overwrite existing record", function() {
            storageService.set("name", "Names James");
            storageService.set("name", "James Bond");
            expect(storageService.get("name")).toEqual("James Bond");
        });
    });

    describe("storageService.get", function() {
        it("should return null on non-existent item", function() {
            expect(storageService.get("hl3")).toEqual(null);
        });

        it("should return valid item", function() {
            storageService.set("listofnumbers", [1, 2, 3]);
            expect(storageService.get("listofnumbers")).toEqual([1, 2, 3]);
        })
    });

    describe("storageService.remove", function() {
        it("should delete records", function() {
            storageService.set("tester", "jasmine");
            storageService.remove("tester");
            expect(storageService.get("tester")).toEqual(null);
        });

    })
});
