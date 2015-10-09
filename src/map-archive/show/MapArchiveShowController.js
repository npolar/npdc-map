'use strict';
/**
 * 
 *
 * @ngInject
 */
var MapArchiveShowController = function ($scope, $controller, $log, $routeParams, MapArchive, NpolarApiSecurity) {
  
  $controller('MapArchiveSearchController', {$scope: $scope});
  
  let show = function() {
        
    MapArchive.fetch($routeParams, (map) => {
    
      $scope.document = map;
  
      $scope.similar = {};
      let relatedQuery = { q: map.title, fields: 'id,code,title,type,publication.year,restricted', score: true, limit: "all" };
      let notSelfQuery = {'not-id': map.id };
      
      MapArchive.array(Object.assign(relatedQuery, notSelfQuery), related => {
        
        $scope.similar.maps = related.filter(r => r._score > 0.4);
        
      });
      
    });

  };  
  
  
  show();
  
  
};

module.exports = MapArchiveShowController;