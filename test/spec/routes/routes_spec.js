// 'use strict';


describe('libraryUiApp routing', function() {
  
  var location, route, rootScope, routeParams;

  beforeEach(module('libraryUiApp'));

  beforeEach(inject(
    function(_$location_, _$route_, _$rootScope_, _$routeParams_) {
      location = _$location_;
      route = _$route_;
      rootScope = _$rootScope_;
      routeParams = _$routeParams_;
    }));

   describe('case insensitive routes', function() {
      beforeEach(inject(
        function($httpBackend) {
          $httpBackend.expectGET('views/book/add-book.html').respond(200);
        }));

      it('should route correctly when route is lower case', function() {
        location.path('/library/quito/add_book');
        rootScope.$digest();

        expect(route.current.controller).toBe('BookCtrl');
      });

      it('should route correctly when route is upper case', function() {
        location.path('/library/quito/ADD_BOOK');
        rootScope.$digest();

        expect(route.current.controller).toBe('BookCtrl');
      });
  });

  describe('library dymanic routes', function() {
    it('correctly identifies library param', function() {
      inject(function($route, $httpBackend) {
        $httpBackend.expectGET('views/book/add-book.html').respond(200);

        location.path('/library/random/add_book');
        rootScope.$digest();

        expect(route.current.pathParams.library).toBe('random');
      });
    });
  });

  describe('route change events', function() {
    it('resets rootScope library when location library changes', 
      inject(function ($http, $httpBackend, ENV) {
        var url = ENV.apiEndpoint + '/library/new_random';
        var previousLocation = { 'pathParams': { 'library': 'random' } };
        var currentLocation = { 'pathParams': { 'library': 'new_random' } };

        $httpBackend.whenGET(url).respond(200, 'libraryData');  

        rootScope.$broadcast('$routeChangeSuccess', currentLocation, previousLocation);

        $httpBackend.flush();
        
        expect(rootScope.library).toBe('libraryData');
      }
    ));

    it('does not reset rootScope library when location library remains the same', 
      inject(function ($http, $httpBackend, ENV) {
        var url = ENV.apiEndpoint + '/library/random';
        var previousLocation = { 'pathParams': { 'library': 'random' } };
        var currentLocation = { 'pathParams': { 'library': 'random' } };

        $httpBackend.whenGET(url).respond(200, 'libraryData');  
        
        spyOn($http, 'get');

        rootScope.library = 'initial';
        rootScope.$broadcast('$routeChangeSuccess', currentLocation, previousLocation);

        expect($http.get).not.toHaveBeenCalled();
        expect(rootScope.library).toBe('initial');
      }
    ));
  });
});