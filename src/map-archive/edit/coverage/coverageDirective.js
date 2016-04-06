"use strict";

let coverageDirective = function () {
  "ngInject";

  return {
    template: require('./coverage.html'),
    controller($scope, $timeout) {
      "ngInject";

      let rectLayer;
      let changesDueToMapSelect = 0;

      let bbox = $scope.field.fields[0];

      let initField = function (field, key) {
        if (!field) {
          field = bbox.itemAdd( /* preventValidation */ true);
        }
        field.step = 0.01;
        field.title = key;
        $scope.$watch(key+'.value', n => {
          if (!changesDueToMapSelect && rectLayer) {
            let newBounds = [
              [$scope.south.value, $scope.west.value],
              [$scope.north.value, $scope.east.value]
            ];
            rectLayer.setBounds(newBounds);
          }
          if (changesDueToMapSelect > 0) {
            changesDueToMapSelect--;
          }
        });
        $scope[key] = field;
      };

      initField(bbox.values[0], 'west');
      initField(bbox.values[1], 'south');
      initField(bbox.values[2], 'east');
      initField(bbox.values[3], 'north');

      let coverage;
      if (bbox.value.length) {
        coverage = [[[$scope.south.value, $scope.west.value],
          [$scope.north.value, $scope.east.value]]];
      }

      $scope.mapOptions = {
        draw: {
          rectangle: true
        },
        edit: {
          edit: true,
          remove: true
        },
        coverage: coverage
      };

      $scope.$on('mapSelect', (e, layer) => {
        changesDueToMapSelect = 4;
        $scope.north.value = Math.round(layer._latlngs[2].lat * 100) / 100;
        $scope.east.value = Math.round(layer._latlngs[2].lng * 100) / 100;
        $scope.south.value = Math.round(layer._latlngs[0].lat * 100) / 100;
        $scope.west.value = Math.round(layer._latlngs[0].lng * 100) / 100;
        rectLayer = layer;
        $timeout();
      });
    }
  };
};

module.exports = coverageDirective;
