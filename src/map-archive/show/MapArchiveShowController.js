'use strict';

// @ngInject
var MapArchiveShowController = function ($scope, $controller, $log, $routeParams, MapArchive) {

  $controller('MapArchiveSearchController', {$scope: $scope});

  let show = function() {
    MapArchive.fetch($routeParams, (map) => {
      $scope.document = map;
      $scope.similar = {};
      let q = map.title +' '+ map.title +' '+ map.code;
      let relatedQuery = { q , fields: 'id,code,title,type,publication.year,restricted', score: true, limit: "all" };
      let notSelfQuery = {'not-id': map.id };

      MapArchive.array(Object.assign(relatedQuery, notSelfQuery), related => {
        $scope.similar.maps = related.filter(r => r._score > 0.4);
      });
    });
  };

  $scope.scale = function (scale) {
    return scale > 0 ? '1:'+scale : '';
  };

  $scope.year = function (year) {
    return year > 0 ? year : 'unknown year';
  };
  
  $scope.principalInvestigators = function(contributors=[]) {
    return contributors.filter(c => c.role === 'principalInvestigator');
  };
  
  $scope.editors = function(contributors=[]) {
    return contributors.filter(c => c.role === 'editor');
  };

  show();
};

module.exports = MapArchiveShowController;
