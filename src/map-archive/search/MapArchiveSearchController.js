'use strict';
/**
 * @ngInject
 */
var MapArchiveSearchController = function ($scope,  $controller, $location, $log,
  npdcAppConfig, MapImageService, MapArchive) {

  $controller('NpolarEditController', { $scope: $scope });

  $scope.resource = MapArchive;
  $scope.img = MapImageService;

  let search = function () {
    
    let defaults = { limit: 25, sort: "-updated", fields: 'id,publication.code,title,subtitle,type,links,images,publication.year,collection,location.area,created,updated',
      facets: 'type,placenames.area,placenames.country,license,restricted,publication.year,publishers.name,publication.country,placenames.hemisphere',
      'rangefacet-publication.year': 50
    };

    let invariants = $scope.security.isAuthenticated() ? {} : { 'filter-restricted': false };
  
    if ($scope.security.isAuthenticated() && $scope.security.isAuthorized('read', MapArchive.path))   {
      defaults.facets += ',archives,publication.code,publication.series';
      defaults['date-year'] = 'created';
      defaults['date-year'] = 'updated';
    }
    let query = Object.assign({}, defaults, invariants);
    $scope.search(query);
  };
  
  
  
  npdcAppConfig.search.local.results = {
    title: (map) => MapImageService.title(map),
    //subtitle: (map) => map.placenames.map(p => p.area).join(''),
    detail: (map) => `${map.type}`
  };
  
  npdcAppConfig.search.local.filterUi = {
    /*'publication.year': {
      type: 'range'
    },
    'year-created': {
      type: 'range'
    },
    'year-updated': {
      type: 'range'
    }*/
  };
  
  $scope.$on('$locationChangeSuccess', (event, data) => {
    search();
  });
  
  search();

};

module.exports = MapArchiveSearchController;
