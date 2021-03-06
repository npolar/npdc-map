'use strict';

// @todo
// change restricted status if license is changed...

function MapArchiveEditController($scope, $controller, formula, formulaAutoCompleteService,
  fileFunnelService, chronopicService, npolarApiConfig, NpolarMessage, NpolarApiSecurity, NpolarLang,
  npdcAppConfig, MapArchive, MapImageService) {

  'ngInject';

  function init() {
    console.log('schema', MapArchive.schema);
    $controller('NpolarEditController', { $scope: $scope });
    $scope.resource = MapArchive;
    $scope.img = MapImageService;

    $scope.formula = formula.getInstance({
      schema: MapArchive.schema,
      language: NpolarLang.getLang(),
      form: 'map-archive/edit/map-archive-formula.json',
      templates: npdcAppConfig.formula.templates.concat([ {
        match: "geometry",
        template: "<map:coverage></map:coverage>"
      }]),
      languages: npdcAppConfig.formula.languages.concat([
      {
        map: require('./map-archive-i18n-no.json'),
        code: 'nb_NO',
        aliases: ['nb']
      },
      {
        map: require('./map-archive-i18n-nn.json'),
        code: 'nn_NO',
        aliases: ['nn']
      },
      {
        map: require('./map-archive-i18n-en.json'),
        code: 'en_GB',
        aliases: ['en']
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
      "publishers.name", "summaries.lang", "comments.lang",
      "publication.country", "publication.where", "publication.code", "publication.series",
      "archives.where", "archives.count", "archives.organisation", "archives.country", "archives.placename",
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
      fields: ['width', 'height', 'modified', 'type', 'ppi']
    }, formula);
  }

  try {
    init();
    $scope.edit().$promise.then((map) => {

      if (map && map._rev && map.files && map.files.length > 0) {
        MapImageService.coverageMap = {
          icon: MapImageService.icon(map.files[0], map),
          title: MapImageService.basename(map.files[0].filename)
        };
      }
    });
  } catch(msg) {
    NpolarMessage.error(msg);
  }
}
module.exports = MapArchiveEditController;
