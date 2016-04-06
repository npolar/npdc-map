'use strict';

/**
 * @ngInject
 */
var router = function ($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true).hashPrefix('!');

  $routeProvider.when('/', {
    redirectTo: '/archive'
  }).when('/archive/:id', {
    templateUrl: 'map-archive/map.html',
    controller: 'MapArchiveShowController'
  }).when('/archive/:id/edit', {
    templateUrl: 'map-archive/map.html',
    controller: 'MapArchiveEditController'
  }).when('/archive', {
    templateUrl: 'map-archive/search/search-map-archive.html',
    controller: 'MapArchiveSearchController',
    reloadOnSearch: false
  });
};

module.exports = router;
