describe("OpenAQClient Controllers", function() {
    beforeEach(module("OpenAQClient"));

    var $httpBackend, $rootScope, createController, getRequestHandler;
    var countriesUrl = "https://api.openaq.org/v1/countries";
    var countriesResponse = { results: [ "Amsterdam", "Andacollo", "Antofagasta" ] };

    describe("CountryCtrl", function() {
        
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
            var controller = createController("CountryCtrl");
            expect($rootScope.query_url).toEqual(countriesUrl);
            $httpBackend.flush();
        });

        describe("$scope.fetch", function() {
            it("should get results", function() {
                var controller = createController("CountryCtrl");
                $rootScope.fetch()
                $httpBackend.flush();
                expect($rootScope.found).toEqual(countriesResponse.results.length);
                expect($rootScope.results).toEqual(countriesResponse.results);
            });
        });
    });

    
});
