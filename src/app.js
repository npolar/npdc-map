'use strict';

var npdcCommon = require('npdc-common');
var AutoConfig = npdcCommon.AutoConfig;

var angular = require('angular');

//require('../node_modules/ng-flow/dist/ng-flow.js');

var npdcMapApp = angular.module('npdcMapArchiveApp', ['npdcCommon']);

npdcMapApp.service('MapImageService', require('./map-archive/image/MapImageService'));
npdcMapApp.controller('MapArchiveShowController', require('./map-archive/show/MapArchiveShowController'));
npdcMapApp.controller('MapArchiveSearchController', require('./map-archive/search/MapArchiveSearchController'));
npdcMapApp.controller('MapArchiveEditController', require('./map-archive/edit/MapArchiveEditController'));

// Bootstrap ngResource models using NpolarApiResource
var resources = [
  {'path': '/map/archive', 'resource': 'MapArchive'},
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

//npdcMapApp.config(flowFactoryProvider => {
//
//  flowFactoryProvider.factory = function (opts) {
//    var Flow = require('flow.js');
//    return new Flow(opts);
//  };
//
//  flowFactoryProvider.defaults = {
//    target: 'http://data.npolar.no:8080/index.php',
//    permanentErrors: [404, 500, 501],
//    maxChunkRetries: 0,
//    chunkRetryInterval: 5000,
//    simultaneousUploads: 4,
//    singleFile: true
//  };
//
//  flowFactoryProvider.on('catchAll', function (event) {
//    console.log('catchAll', arguments);
//  });
//
//});


// Inject npolarApiConfig and run
npdcMapApp.run((npolarApiConfig, npdcAppConfig) => {
  var environment = "production";
  var autoconfig = new AutoConfig(environment);
  angular.extend(npolarApiConfig, autoconfig, { resources, formula : { template : 'default' } });
  console.log("npolarApiConfig", npolarApiConfig);

  npdcAppConfig.cardTitle = '';
  npdcAppConfig.toolbarTitle = 'Map archive';
});
