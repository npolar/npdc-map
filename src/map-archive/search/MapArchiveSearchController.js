'use strict';
/**
 * @ngInject
 */
var MapArchiveSearchController = function ($scope,  $controller, $location, $log, MapArchive, MapImageService, NpdcAutocompleteConfig) {

  $controller('NpolarEditController', { $scope: $scope });
  
  $scope.resource = MapArchive;
  $scope.img = MapImageService;
    
  let defaults = { limit: 25, sort: "-updated", fields: 'id,title,code,links,publication.year,collection',
    facets: 'type,location.area,location.country',
    'rangefacet-publication.year': 25
  };
  
  let invariants = $scope.security.isAuthenticated() ? {} : { 'not-restricted': true, 'filter-links.rel': 'edit-media',
    'filter-links.length': '1..'
  };
           
  if ($scope.security.isAuthenticated() && $scope.security.isAuthorized('read', MapArchive.path))   {

    defaults.facets += ',archives.organisation,publication.publisher,publication.restricted,code,publication.series,publication.country,location.hemisphere';
    
    if (!$location.search()['filter-created']) {
      defaults['date-year'] = 'created';
    } else {
      defaults['date-month'] = 'created';
    }
  }
        
  let query = Object.assign(defaults, $location.search(), invariants);
  
  NpdcAutocompleteConfig.selectedDefault = ['map/archive'];
  NpdcAutocompleteConfig.placeholder = 'Search map archive';
  NpdcAutocompleteConfig.query = defaults;
  
  $scope.search(query);

};

module.exports = MapArchiveSearchController;