'use strict';

function MapArchiveEditController($scope, $controller, $http, $log, $routeParams, $window,
  formula, formulaAutoCompleteService, fileFunnelService, chronopicService,                            
  npolarApiConfig, NpolarMessage, NpolarApiSecurity, NpolarLang,
  npdcAppConfig, NpdcSearchService, 
  MapArchive, MapImageService) {
  
  'ngInject';

  function init() {
    $controller('NpolarEditController', { $scope: $scope });
    $scope.resource = MapArchive;
    $scope.img = MapImageService;
    
    $scope.formula = formula.getInstance({
      schema: MapArchive.schema,
      language: NpolarLang.getLang(),
      form: 'map-archive/edit/map-archive-formula.json',
      templates: npdcAppConfig.formula.templates,
      languages: npdcAppConfig.formula.languages.concat([{
        map: require('./map-archive-i18n-no.json'),
        code: 'nb_NO',
        aliases: ['nb']
      },
      {
        map: require('./map-archive-i18n-nn.json'),
        code: 'nn_NO',
        aliases: ['nn']
      }])
    });
    
    initFormulaFileUpload($scope.formula);
    
    formulaAutoCompleteService.autocomplete({
      match(field) { return (field.id === 'lang' || field.id === 'languages_item'); },
      querySource: npolarApiConfig.base + '/language',
      label: 'native',
      value: 'code'
    }, $scope.formula);
    
    formulaAutoCompleteService.autocomplete({
      match: "country",
      querySource: npolarApiConfig.base + '/country',
      label: 'native',
      value: 'code'
    }, $scope.formula);
      
    let autocompleteFacets = ["title", "preamble", "subtitle",
      "publishers.name",
      "summaries.lang",
      "comments.lang",
      "publication.country", "publication.where", "publication.code", "publication.series",
      "archives_item.where", "archives_item.count", "archives_item.organisation", "archives_item.country", "archives_item.placename",
      "contributors.name", "contributors.role", "contributors.email", "contributors.homepage",
      "tags"];
    formulaAutoCompleteService.autocompleteFacets(autocompleteFacets, $scope.resource, $scope.formula);    
    //chronopicService.defineOptions('#/rightsExpire', {locale: NpolarLang.getLang(), format: '{YYYY}-{MM}-{DD}'});
  }

  function initFormulaFileUpload(formula) {
    
    let server = `${NpolarApiSecurity.canonicalUri(npolarApiConfig.base)}/map/archive/:id/_file`;
    
    fileFunnelService.fileUploader({
      match(field) {
        return field.id === "files";
      },
      server,
      multiple: true,
      restricted: function () {
        return formula.getModel().restricted;
      },
      fileToValueMapper: MapImageService.imageFromFile,
      valueToFileMapper: MapImageService.fileFromImage,
      fields: [] //['restricted', 'width', 'height']
    }, formula);  
  }
  
  try {
    init();
    $scope.edit();                  
  } catch(msg) {
    NpolarMessage.error(msg);
  }
}
module.exports = MapArchiveEditController;