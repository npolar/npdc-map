'use strict';

// @ngInject
var MapArchiveShowController = function ($scope, $controller, $log, $routeParams,
  NpolarApiSecurity, NpolarLang, MapArchive) {

  $controller('MapArchiveSearchController', {$scope: $scope});

  let show = function() {
    MapArchive.fetch($routeParams, (map) => {

      $scope.document = map;
      $scope.similar = {};
      $scope.images = [];
      
      let rightsHolders = (map.contributors||[]).filter(c => { return (c.role === 'rightsHolder' && c.name); });
      
      if (rightsHolders.length > 0) {
        $scope.rightsHolders = rightsHolders.map(r => r.name);
      } else if (map.publishers) {
        $scope.rightsHolders = (map.publishers||[]).map(p => p.name);
      }

      if (map.files) {
        $scope.images = map.files.filter(f => (/^image\//).test(f.type));
      }
      
      let q = map.title +' '+ map.title +' '+ map.code;
      let relatedQuery = { q , fields: 'id,code,title,type,publication.year,restricted', score: true, limit: "all" };
      let notSelfQuery = {'not-id': map.id };

      MapArchive.array(Object.assign(relatedQuery, notSelfQuery), related => {
        $scope.similar.maps = related.filter(r => r._score > 0.4);
      });
      
    });
  };
  
  $scope.key = function() {
    let system = NpolarApiSecurity.getSystem('read', MapArchive.path);
    if (system.key) {
      return system.key;
    }
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
  
  $scope.language = function(code) {
    return code;
  };

  show();
};

module.exports = MapArchiveShowController;
