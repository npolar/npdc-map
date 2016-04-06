'use strict';

function MapArchiveShowController($scope, $controller, $log, $routeParams,
  NpolarApiSecurity, MapArchive, MapImageService) {
  
  'ngInject';
  
  const npolar = 'Norsk Polarinstitutt';

  $controller('MapArchiveSearchController', {$scope: $scope});
  
  function init() {
    $scope.document = {};
    $scope.similar = {};
    $scope.images = [];
    setMapOptions({});
  }
  
  function setMapOptions(object) {
    $scope.mapOptions = object;
  }
  
  function attributionNames(map) {
    let names = [];
    let rightsHolders = (map.contributors||[]).filter(c => { return (c.role === 'rightsHolder' && c.name); });     
    if (rightsHolders.length > 0) {
      names = rightsHolders.map(r => r.name);
    } else if (map.publishers) {
      names = (map.publishers||[]).map(p => p.name);
    }
    if (names.length === 0) {
      names = npolar;
    }
    console.log(names,map);
    return names;
  }
  
  let show = function() {
    MapArchive.fetch($routeParams, (map) => {

      $scope.document = map;
      $scope.attributionNames = attributionNames(map);
      $scope.document.organisations = map.contributors; 

     
      
      if (map.files) {
        $scope.images = map.files.filter(f => (/^image\//).test(f.type));
      }
      
      if (map.geometry && map.geometry.bbox.length === 4) {
        let bbox = map.geometry.bbox;
        let bounds = [ [bbox[1], bbox[0]], [bbox[3], bbox[2]] ];

        $scope.mapOptions.bbox = map.geometry.bbox;
        $scope.mapOptions.images = [MapImageService.icon($scope.images[0], map)];
        $scope.mapOptions.coverage = [bounds];
        //$scope.mapOptions.geojson = "geojson";
      }
      
      
      // todo f(x)
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

  init();
  show();
}

module.exports = MapArchiveShowController;
