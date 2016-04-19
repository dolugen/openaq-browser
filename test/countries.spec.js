describe("CountriesController", function() {
    beforeEach(function() {
        module("app")
    });

    var $httpBackend, $rootScope, createController, getRequestHandler;
    var countriesUrl = "https://api.openaq.org/v1/countries";
    var countriesResponse = {
        results: [ "Amsterdam", "Andacollo", "Antofagasta" ],
        meta: {
            found: 3
        }};

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get("$httpBackend");
        getRequesthandler = $httpBackend.when("GET", countriesUrl)
            .respond(countriesResponse);

        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');
        createController = function(name) {
            return $controller(name, {'$scope': $rootScope});
        };
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should have the correct target address", function() {
        var controller = createController("CountriesController");
        expect($rootScope.query_url).toEqual(countriesUrl);
        $httpBackend.flush();
    });

    describe("$scope.fetch", function() {
        it("should get results", function() {
            var controller = createController("CountriesController");
            $rootScope.submit();
            $httpBackend.flush();
            expect($rootScope.total).toEqual(countriesResponse.meta.found);
            expect($rootScope.results).toEqual(countriesResponse.results);
        });
    });

});
