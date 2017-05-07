(function() {
  'use strict';

  angular
    .module('minotaur')
    .controller('MapsLeafletController', MapsLeafletController)
    .controller('BasicCenterAutodiscoverController', BasicCenterAutodiscoverController)
    .controller('LeafletControlsDrawController', LeafletControlsDrawController)
    .controller('LeafletGoogleMapsController', LeafletGoogleMapsController)
    .controller('LeafletLayersHeatmapController', LeafletLayersHeatmapController);

  /** @ngInject */
  function MapsLeafletController() {


  }

  function BasicCenterAutodiscoverController() {
    var vm = this;
    vm.center = {
      autoDiscover: true
    }
  }

  function LeafletControlsDrawController(leafletData, L, $window) {
    var vm = this;

    vm.london = {
      lat: 51.505,
      lng: -0.09,
      zoom: 4
    };
    vm.layers = {
      baselayers: {
        mapbox_light: {
          name: 'Mapbox Light',
          url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
          type: 'xyz',
          layerOptions: {
            apikey: 'pk.eyJ1IjoidGF0dGVrIiwiYSI6ImNpdHBsMnZ5NDAwMGEydHFmdzdjMHkwYWQifQ.KDMamAdg4ygu4QRbb6QSPg',
            mapid: 'mapbox.satellite'
          },
          layerParams: {
            showOnSelector: false
          }
        }
      }
    };

    leafletData.getMap('map3').then(function(map) {

      map.editTools = new L.Editable(map);

      L.EditControl = L.Control.extend({
        options: {
          position: 'topleft',
          callback: null,
          kind: '',
          html: ''
        },
        onAdd: function (map) {
          var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
              link = L.DomUtil.create('a', '', container),
              vm = this;

          link.href = '#';
          link.title = 'Create a new ' + vm.options.kind;
          link.innerHTML = vm.options.html;
          L.DomEvent.on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', function () {
              $window.LAYER = vm.options.callback.call(map.editTools);
            }, vm);
          return container;
        }
      });

      L.NewLineControl = L.EditControl.extend({
        options: {
          position: 'topleft',
          callback: map.editTools.startPolyline,
          kind: 'line',
          html: '\\/\\'
        }
      });

      L.NewPolygonControl = L.EditControl.extend({
        options: {
          position: 'topleft',
          callback: map.editTools.startPolygon,
          kind: 'polygon',
          html: '▰'
        }
      });

      L.NewMarkerControl = L.EditControl.extend({
        options: {
          position: 'topleft',
          callback: map.editTools.startMarker,
          kind: 'marker',
          html: '🖈'
        }
      });

      map.addControl(new L.NewMarkerControl());
      map.addControl(new L.NewLineControl());
      map.addControl(new L.NewPolygonControl());
    });
  }

  function LeafletGoogleMapsController() {
    var vm = this;
    vm.berlin = {
      lat: 52.52,
      lng: 13.40,
      zoom: 14
    };
    vm.markers = {
      m1: {
        lat: 52.52,
        lng: 13.40
      }
    };
    vm.layers = {
      baselayers: {
        googleTerrain: {
          name: 'Google Terrain',
          layerType: 'TERRAIN',
          type: 'google'
        },
        googleHybrid: {
          name: 'Google Hybrid',
          layerType: 'HYBRID',
          type: 'google'
        },
        googleRoadmap: {
          name: 'Google Streets',
          layerType: 'ROADMAP',
          type: 'google'
        }
      }
    };
  }

  function LeafletLayersHeatmapController($http) {
    var vm = this;

    $http.get("app/components/jsons/heat-points.json").success(function(data) {
      vm.layers.overlays = {
        heat: {
          name: 'Heat Map',
          type: 'heat',
          data: data,
          layerOptions: {
            radius: 20,
            blur: 10
          },
          visible: true
        }
      };
    });

    vm.center = {
      lat: 37.774546,
      lng: -122.433523,
      zoom: 12
    };

    vm.layers = {
      baselayers: {
        mapbox_light: {
          name: 'Mapbox Light',
          url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
          type: 'xyz',
          layerOptions: {
            apikey: 'pk.eyJ1IjoidGF0dGVrIiwiYSI6ImNpdHBsMnZ5NDAwMGEydHFmdzdjMHkwYWQifQ.KDMamAdg4ygu4QRbb6QSPg',
            mapid: 'mapbox.satellite'
          }
        }
      }
    };

  }

})();
