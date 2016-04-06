'use strict';

var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;
var angular = require('angular');
require('npdc-common/src/wrappers/leaflet');


var npdcMapApp = angular.module('npdcMapArchiveApp', ['npdcCommon', 'leaflet']);

/*npdcMapApp.factory('L', function() {
  return window.L; // assumes Leaflet has already been loaded on the page
});*/

npdcMapApp.service('MapImageService', require('./map-archive/image/MapImageService'));
npdcMapApp.factory('MapArchive', require('./map-archive/edit/MapArchive'));
npdcMapApp.controller('MapArchiveShowController', require('./map-archive/show/MapArchiveShowController'));
npdcMapApp.controller('MapArchiveSearchController', require('./map-archive/search/MapArchiveSearchController'));
npdcMapApp.controller('MapArchiveEditController', require('./map-archive/edit/MapArchiveEditController'));

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/map/archive', 'resource': 'MapArchiveResource'},
];

resources.forEach(service => {
  // Expressive DI syntax is needed here
  npdcMapApp.factory(service.resource, ['NpolarApiResource', function (NpolarApiResource) {
    return NpolarApiResource.resource(service);
  }]);
});

// Routes
npdcMapApp.config(require('./routes'));

// API HTTP interceptor
npdcMapApp.config($httpProvider => {
  $httpProvider.interceptors.push('npolarApiInterceptor');
});

// Inject npolarApiConfig and run
npdcMapApp.run(($http, npolarApiConfig, npdcAppConfig, NpolarTranslate, NpolarLang) => {
  
  var environment = "production";
  var autoconfig = new AutoConfig(environment);
  
  Object.assign(npolarApiConfig, autoconfig, { resources, formula : { template : 'default' } });
  console.log("npolarApiConfig", npolarApiConfig);

  // i18n
  $http.get('//api.npolar.no/text/?q=&filter-bundle=npdc-map&format=json&variant=array&limit=all').then(response => {
    
    NpolarTranslate.appendToDictionary(response.data);
    
    NpolarTranslate.dictionary['npdc.app.Title'] = [
      {'@language': 'en', '@value': 'Map archive'},
      {'@language': 'no', '@value': 'Kartarkiv'}
    ];
    NpolarLang.setLanguages(npdcAppConfig.i18n.languages);
  });
});