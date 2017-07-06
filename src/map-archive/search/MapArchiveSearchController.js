'use strict';

var MapArchiveSearchController = function ($scope,  $controller, $location, $http, $timeout, $window,
  npdcAppConfig, NpolarEsriLeaflet,
  MapImageService, MapArchive, NpolarTranslate) {

  'ngInject';

  $controller('NpolarEditController', { $scope: $scope });

  NpolarTranslate.dictionary['npdc.app.Title'] = [
    {'@language': 'en', '@value': 'Map archive'},
    {'@language': 'no', '@value': 'Kart'}
  ];

  $scope.resource = MapArchive;
  $scope.img = MapImageService;
  $scope.drawMap = false ;

  $scope.showNext = function() {
    if (!$scope.feed) {
      return false;
    }
    return ($scope.feed.entries.length < $scope.feed.opensearch.totalResults);
  };

  $scope.next = function() {
    if (!$scope.feed.links) {
      return;
    }

    let nextLink = $scope.feed.links.find(link => { return (link.rel === "next"); });
    if (nextLink.href) {
      $http.get(nextLink.href.replace(/^https?:/, '')).success(function(response) {

        let uniq = [];
        response.feed.entries.forEach(e => {
          let f = $scope.feed.entries.find(existing => {
            let exists = (existing.id === e.id);
            return exists;
          });
          if (!f) {
            uniq.push(e);
          }
        });

        response.feed.entries = $scope.feed.entries.concat(uniq);

        $scope.feed = response.feed;
        console.log('feed',$scope.feed.entries.length);
      });
    }
  };

  function mapFactory() {

    NpolarEsriLeaflet.element = 'bbox-map';

    let map = NpolarEsriLeaflet.mapFactory();
    map.setView([69, 0], 4);

    let attribution = `<a href="http://npolar.no">Norsk Polarinstitutt</a>`; // &mdash; Data: <a href="${}">Who</a>`;
    map.attributionControl.addAttribution(attribution);
    return map;

  }

  let search = function () {

    let limit = $location.search().limit || 40;
    let defaults = { limit, sort: "-updated",
    fields: 'id,publication,title,subtitle,type,links,files,collection,location,created,updated,geometry,license',
    facets: 'type,placenames.area,license,publication.year,publishers.name,publication.country,scales,restricted',
    'rangefacet-publication.year':100
    };

    let invariants = {}; //$scope.security.isAuthenticated() ? {} : { 'filter-files.length': '1..' };

    if ($scope.security.isAuthenticated() && $scope.security.isAuthorized('read', MapArchive.path))   {
      //defaults['date-year'] = 'created';
      //defaults['date-year'] = 'updated';
      //defaults['restricted'] = false;
    }
    // Show only open access maps (on first load, if not authenticated, and if no query)
    if (!$scope.security.isAuthenticated() && (!$location.search().q  || $location.search().q === "")) {
      // FIXME angular.js:14199 TypeError: Cannot read property 'term' of undefined
    // at filterValue (QueryBuilder.js:21)
    // at QueryBuilder.js:36
      //$location.search(Object.assign({}, $location.search(), { 'filter-restricted': 'false' }));
    }
    let query = Object.assign({}, defaults, invariants);

    $scope.search(query).$promise.then(r =>{
      let extents = r.feed.entries.filter(e => {
        return (e.geometry && e.geometry.bbox && e.geometry.bbox.length >= 4);
      });


      let drawBboxes = false;
      if ($scope.drawMap && extents.length > 0) {
        $scope.bboxLayers = extents.map(m => {
          return drawExtent(m);
        });


        console.log(`Added ${$scope.bboxLayers.length} bbox layers`);

        //$scope.map.invalidateSize();
        let evt = $window.document.createEvent('UIEvents');
        evt.initUIEvent('resize', true, false, $window, 0);
        $window.dispatchEvent(evt);
        $window.dispatchEvent(new Event('resize'));

        // $scope.map.fitBounds($scope.bboxLayers[0]);




      }
    });


  };


  function drawExtent(map) {

    let west = map.geometry.bbox[0];
    let south = map.geometry.bbox[1];
    let east = map.geometry.bbox[2];
    let north = map.geometry.bbox[3];

    let bbox = [
      [south, west],
      [north, east]
    ];

    let layer = L.rectangle(bbox, {
      color: "green",
      weight: 3
    });

    layer.on('click', function(e,l) {
      console.log('click bbox', e);
      //$scope.feed
    });

    return layer.addTo($scope.map);
  }


  npdcAppConfig.search.local.results = {
    title: (map) => MapImageService.title(map),
    //subtitle: (map) => map.placenames.map(p => p.area).join(''),
    detail: (map) => `${map.type}`
  };

  npdcAppConfig.search.local.filterUi = {
    /*'publication.year': {
      type: 'range'
    },
    'year-created': {
      type: 'range'
    },
    'year-updated': {
      type: 'range'
    }*/
  };

  $scope.$on('$locationChangeSuccess', (event, data) => {
    //if ($scope.drawMap && $scope.bboxLayers) {
    //  console.log(`Removing ${$scope.bboxLayers.length} bbox layers`);
    //  $scope.bboxLayers.forEach(bboxLayer => {
    //    $scope.map.removeLayer(bboxLayer);
    //  });
    //  $scope.bboxLayers=[];
    //}
    search();
  });

  try {

    // Wrap Leaflet map in a $timeout
    $timeout(() => {
      if ($scope.drawMap) {
        $scope.map = mapFactory();
      }
      search();
    }, 1); // end $timeout


  } catch (e) {
    //NpolarMessage.error(e);
  }


};

module.exports = MapArchiveSearchController;
