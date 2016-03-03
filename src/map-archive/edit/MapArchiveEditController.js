'use strict';
// FIXME new => set processor, archives etc.

// authors/editors
//"homepage": {
//  "type": "string",
//  "description": "Web address of rights holder"
//},
//"

// code => sheet ?
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
let MapArchiveEditController = function ($scope, $controller, $http, $log, $routeParams, $window,
  formula, formulaAutoCompleteService, fileFunnelService, chronopicService,                            
  npolarApiConfig, npdcAppConfig, NpdcSearchService, NpolarApiSecurity, NpolarLang, 
  MapArchive, MapImageService) {
  
  const schema = '//api.npolar.no/schema/map-archive-1';
  
  $controller('NpolarEditController', { $scope: $scope });
  $scope.resource = MapArchive;
  $scope.img = MapImageService;

  $scope.formula = formula.getInstance({
    schema,
    form: 'map-archive/edit/map-archive-formula.json',
    templates: npdcAppConfig.formula.templates,
    languages: npdcAppConfig.formula.languages
  });
  
  let autocompleteFacets = ['publishers.name', 'rightsHolder.name', 'archives.organisation', 'publication.country'];
  formulaAutoCompleteService.autocompleteFacets(autocompleteFacets, $scope.resource, $scope.formula);
  
  //chronopicService.defineOptions('#/rightsExpire', {locale: NpolarLang.getLang(), format: '{YYYY}-{MM}-{DD}'});
  
  // New action, ie. create new document and edit with formula
  // @override
  $scope.newAction = function() {
    // Set "processor" to current user
    let user = $scope.security.getUser();
    let processor = {
      email: user.email,
      name: user.name
    };
    let contributors = [{ name: user.name, role: 'editor', email: user.email }];
    let type = 'topographic';
    let collection = 'map-archive';
    let title = `New map created by ${user.name}`; 
    let archives = [
      {
        'placename': 'Tromsø',
        'where': '5083',
        'count': 1,
        'country': 'NO',
        'organisation': 'Norsk Polarinstitutt'
      }
    ];
    $scope.document = { title, type, collection, schema, archives, processor, contributors };
    $scope.formula.model = $scope.document;
  };
  
  let r = $scope.edit(true /* generate uuid */);
  
  if (r && r.$promise) {
    r.$promise.then(map => {
      
      // File funnel upload
      fileFunnelService.fileUploader({
        match(field) {
          return field.id === "images";
        },
        server: `${NpolarApiSecurity.canonicalUri(npolarApiConfig.base)}/map/archive/${$routeParams.id}/_file`,
        multiple: true,
        progress: false,
        restricted: map.restricted,
        successCallback: MapImageService.editMediaLinkFromFileUpload
      }, $scope.formula);


    });
  }

};

module.exports = MapArchiveEditController;