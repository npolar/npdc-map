'use strict';
/**
 * @ngInject
 */
var MapArchiveSearchController = function ($scope,  $controller, $location, $log, $http,
  npdcAppConfig, MapImageService, MapArchive, NpolarTranslate) {
  

  $controller('NpolarEditController', { $scope: $scope });
  
  NpolarTranslate.dictionary['npdc.app.Title'] = [
    {'@language': 'en', '@value': 'Map archive'},
    {'@language': 'no', '@value': 'Kart'}
  ];

  $scope.resource = MapArchive;
  $scope.img = MapImageService;
  
    $scope.showNext = function() {
    if (!$scope.feed) {
      return false;
    }
    return ($scope.feed.entries.length < $scope.feed.opensearch.totalResults);
  };

  $scope.next = function() {
    if (!$scope.feed.links) {
      return;
    }

    let nextLink = $scope.feed.links.find(link => { return (link.rel === "next"); });
    if (nextLink.href) {
      $http.get(nextLink.href.replace(/^https?:/, '')).success(function(response) {
        response.feed.entries = $scope.feed.entries.concat(response.feed.entries);
        $scope.feed = response.feed;
      });
    }
  };

  

  let search = function () {
    
    let defaults = { limit: 16, sort: "-updated", fields: 'id,publication.code,title,subtitle,type,links,files,publication.year,collection,location.area,created,updated',
      facets: 'type,placenames.area,placenames.country,license,restricted,publication.year,publishers.name,publication.country,placenames.hemisphere,contributors.name,contributors.role,sca  les',
      'rangefacet-publication.year': 50
    };

    let invariants = $scope.security.isAuthenticated() ? {} : { 'filter-files.length': '1..' };
  
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
