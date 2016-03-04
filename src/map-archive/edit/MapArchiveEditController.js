'use strict';

/**
 * @ngInject
 */
let MapArchiveEditController = function ($scope, $controller, $http, $log, $routeParams, $window,
  formula, formulaAutoCompleteService, fileFunnelService, chronopicService,                            
  npolarApiConfig, npdcAppConfig, NpdcSearchService, NpolarApiSecurity, NpolarLang, 
  MapArchive, MapImageService) {

  $controller('NpolarEditController', { $scope: $scope });
  $scope.resource = MapArchive;
  $scope.img = MapImageService;
  
  $scope.formula = formula.getInstance({
    schema: MapArchive.schema,
    form: 'map-archive/edit/map-archive-formula.json',
    templates: npdcAppConfig.formula.templates,
    languages: npdcAppConfig.formula.languages
  });
  
  let autocompleteFacets = ['publishers.name', 'rightsHolder.name', 'archives.organisation', 'publication.country'];
  formulaAutoCompleteService.autocompleteFacets(autocompleteFacets, $scope.resource, $scope.formula);
  
  //chronopicService.defineOptions('#/rightsExpire', {locale: NpolarLang.getLang(), format: '{YYYY}-{MM}-{DD}'});
    
  let r = $scope.edit(true /* generate uuid */);
  
  if (r && r.$promise) {
    
    r.$promise.then(map => {
      let server = `${NpolarApiSecurity.canonicalUri(npolarApiConfig.base)}/map/archive/${$routeParams.id}/_file`;
      console.log(server);
      // File funnel upload
      fileFunnelService.fileUploader({
        match(field) {
          return field.id === "images";
        },
        server,
        multiple: true,
        progress: false,
        restricted: map.restricted,
        successCallback: MapImageService.editMediaLinkFromFileUpload
      }, $scope.formula);


    });
  }

};

module.exports = MapArchiveEditController;