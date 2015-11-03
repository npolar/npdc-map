'use strict';
/**
 * @ngInject
 */
var MapArchiveSearchController = function ($scope,  $controller, $location, $log, MapArchive, MapImageService, npdcAppConfig) {

  $controller('NpolarEditController', { $scope: $scope });

  $scope.resource = MapArchive;
  $scope.img = MapImageService;

  let defaults = { limit: 25, sort: "-updated", fields: 'id,publication.code,title,subtitle,links,publication.year,collection,location.area',
    facets: 'type,location.area,location.country',
    'rangefacet-publication.year': 25
  };

  let invariants = $scope.security.isAuthenticated() ? {} : { 'not-restricted': true, 'filter-links.rel': 'edit-media'
    //,'filter-links.length': '0..'
  };

  if ($scope.security.isAuthenticated() && $scope.security.isAuthorized('read', MapArchive.path))   {
    defaults.facets += ',archives.restricted,organisation,publication.publisher,publication.code,publication.series,publication.country,location.hemisphere';
    if (!$location.search()['filter-created']) {
      defaults['date-year'] = 'created';
    } else {
      defaults['date-month'] = 'created';
    }
  }

  let search = function () {
    let query = Object.assign(defaults, $location.search(), invariants);
    $scope.search(query);
  };

  search();

  npdcAppConfig.cardTitle = "Map Archive";
  npdcAppConfig.search.results = {
    subtitle: "location/area",
    detail: "publication/year"
  };

  $scope.gotoMap = function (id) {
    $location.url('/archive/'+id);
  };

  $scope.$on('$locationChangeSuccess', (event, data) => {
    search();
  });

};

module.exports = MapArchiveSearchController;
