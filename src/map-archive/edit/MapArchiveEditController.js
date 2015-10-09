'use strict';
// @todo
// authors/editors
// rightsHolder
// licensing / metadata
// languages
// remove placename
// citation?
// => countries /locations
// code => sheet
//// show => hemisphere
//
//ISO 19115	/ 19115-1 roles
//+ resourceProvider
//+ custodian
//+ owner
//+ user
//+ distributor
//+ originator
//+ pointOfContact 
//+ principalInvestigator 
//+ processor 
//+ publisher 
//+ author
//+ sponsor
//+ coAuthor
//+ collaborator
//+ editor
//+ mediator
//+ rightsHolder
//+ contributor
//+ funder
//+ stakeholder

/**
 * @ngInject
 */
var MapArchiveEditController = function ($scope, $controller, $http, $log, $routeParams, $window, NpolarApiSecurity, MapArchive, MapImageService) {
    
  // Extend -> NpolarEditController
  $controller('NpolarEditController', { $scope: $scope });

  // MapArchive -> npolarApiResource -> ngResource
  $scope.resource = MapArchive;
  
  $scope.img = MapImageService;
  
  let user = $scope.security.getUser();
  
  let processor = {
    email: user.email,
    name: user.name
  };

  // Formula ($scope.formula is set by parent)
  $scope.formula.schema = `//${MapImageService.schema.split('//')[1]}`;
  console.debug(MapImageService.schema);
  $scope.formula.template = 'material';
  $scope.formula.form = 'map-archive/edit/map-archive-formula.json';
  
  
  // Edit action, ie. fetch document and edit with formula
  // @override
  $scope.editAction = function() {
    
    $scope.resource.fetch($routeParams, function(document) {
      
      // Automatically add link to TIFF (link.rel = edit-media)
      if (!document.links) {
        document.links = [MapImageService.editMediaLink(document)];
      }     
      $scope.document = document;
      $scope.formula.model = document;
      
    });
  };

  // New action, ie. create new document and edit with formula
  // @override
  $scope.newAction = function() {
    $scope.document = MapImageService.newMap(processor);
    $scope.formula.model = $scope.document;
  };
  
  $scope.edit();

};

module.exports = MapArchiveEditController;