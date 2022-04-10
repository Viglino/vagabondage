import olObject from 'ol/Object'
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { toLonLat } from 'ol/proj';
import { getDistance } from 'ol/sphere';
import VectorLayer from 'ol/layer/Vector';
import element from 'ol-ext/util/element'

import pages from './page/pages'
import map from './map/map';
import dialog, { info } from './map/dialog';
import { clcInfo } from './vectorLoader/mapLoader';
import vectorLoader from './vectorLoader/vectorLoader';
import layer, { layerCarte } from './map/layer'
import routing from './map/routing';

import vtlayer from './vectorLoader/vtMap'
import mapInfo from './vectorLoader/mapInfo'

import './game.css'

/** Game object
 */
class Game extends olObject {
  constructor() {
    super();
    this.map = map
    // Show destination / 
    const d = element.create('UL', {
      className: 'jumper',
      parent: document.body
    })
    element.create('LI', {
      html: '<i class="fg-position"></i> Position',
      click: () => this.flyTo(this.get('position')),
      parent: d
    })
    element.create('LI', {
      html: '<i class="fg-location-arrow"></i> Destination',
      click: () => this.flyTo(this.get('end')),
      parent: d
    })
    element.create('LI', {
      html: '<i class="fg-map-legend"></i> Legende',
      click: () => pages.showLegend(),
      parent: d
    })
    routing.on('routing', e => this.nextStep(e));
    // Add layers
    this.layer = {
      building: new VectorLayer({
        title: 'building',
        source: vectorLoader.source.bati,
        minZoom: 15,
        style: []
      }),
      road: new VectorLayer({
        title: 'road',
        source: vectorLoader.source.route,
        minZoom: 14,
        style: []
      })
    };
    this.map.addLayer(this.layer.building);
    this.map.addLayer(this.layer.road);
  }
}

/** Fly to postion
 * @param {ol/Coordinate} position
 */
Game.prototype.flyTo = function(position) {
  this.map.getView().flyTo({
    center: position,
    zoomAt: Math.max(this.map.getView().getZoom() - .5, 13.01)
  })
}

/** Set current status
 * 
 */
Game.prototype.getStatus = function(road, land, bati) {
  const status = {
    route: road.get('cpx_classement_administratif') + ' '
      + road.get('cpx_numero') + ' - '
      + road.get('cpx_gestionnaire'),
    nature: road.get('nature') + ' - ' + road.get('sens_de_circulation'),
    vitesse: road.get('vitesse_moyenne_vl') + ' km/h',
    importance: road.get('importance'),
    paysage: clcInfo[land.get('code_18')].title + ' ('+land.get('code_18')+')',
    destination: (getDistance(toLonLat(this.get('position')), toLonLat(this.get('end')))/1000).toFixed(1) + ' km'
  };
  info.status(status);
  return status;
}

/** Load a new game in region
 * @param {string} region region id
 */
Game.prototype.load = function(region) {
  vectorLoader.loadGame(region, g => {
    for (let i in g) this.set(i, g[i]);
    this.set('position', this.get('start'));
    // Status
    const status = this.getStatus(g.road, g.land);
    //layer.getSource().addFeature(g.road);
    layer.getSource().addFeature(new Feature({
      type: 'start',
      geometry: new Point(g.start)
    }));
    const geom = g.road.getGeometry().getCoordinates();
    const dx = geom[1][0] - geom[0][0]
    const dy = geom[1][1] - geom[0][1]
    const a = Math.PI/2 + Math.atan2(-dy,dx);
    const offset = g.road.get('importance') == 3 ? 5 : 3;
    const dp = [
      g.start[0] + offset * Math.cos(a),
      g.start[1] - offset * Math.sin(a)
    ]
    layer.getSource().addFeature(new Feature({ 
      style: 'car', 
      rot: a,
      geometry: new Point(dp)
    }));
    layerCarte.getSource().addFeature(new Feature({
      style: 'end',
      geometry: new Point(g.end)
    }));
    layer.getSource().addFeature(g.building);

    vectorLoader.getRouting(g.start, g.end, result => {
      layer.getSource().addFeature(result.feature);
      status['distance'] = (result.distance/1000).toFixed(1)+' km';
      const h = Math.floor(result.duration / 60)
      status['temps estimé'] = h+'h'+('0'+Math.floor(result.duration-h*60)).substr(-2);
      info.status(status)
    });
    dialog.hide();

    // Set center
    layerCarte.getSource().addFeature(new Feature({
      style: 'start',
      geometry: new Point(g.start)
    }));

    this.start();
  })
}

/** Start a new game
 */
Game.prototype.start = function() {
  // Zoom to start
  this.map.getView().takeTour([{
    type: 'flyTo', 
    center: this.get('start'),
    zoom: 19,
    zoomAt: map.getView().getZoom() - .1
  }], {
    done: () => {
      this.map.getView().setMinZoom(13.01);
      vectorLoader.setActive(['clc','bati','route'], this.get('start'));
    }
  })
}

Game.prototype.nextStep = function(e) {
  const position = e.end;
  this.set('position', position);
  // Add features to the map
  e.routing.feature.set('style', 'route');
  layer.getSource().addFeature(e.routing.feature);
  layer.getSource().addFeature(new Feature({
    style: 'poi',
    geometry: new Point(position)
  }));
  layerCarte.getSource().addFeature(e.routing.feature);
  // Get around
  this.map.getView().setCenter(position);
  setTimeout(() => console.table(mapInfo.getAround(20, position)));
  vectorLoader.setActive(['clc','bati','route'], position);
  vectorLoader.once('ready', () => {
    const building = vectorLoader.source.bati.getClosestFeatureToCoordinate(position);
    const road = vectorLoader.source.route.getClosestFeatureToCoordinate(position);
    const land = vectorLoader.source.clc.getClosestFeatureToCoordinate(position);
    this.getStatus(road, land, building);
  })
}

/** Set debug mode
 * @param {boolean} b
 */
Game.prototype.debug = function(b) {
  // Switch debug mode
  if (b) {
    document.body.dataset.debug = '';
    game.layer.building.setStyle();
    game.layer.road.setStyle();
  } else {
    delete document.body.dataset.debug;
    game.layer.building.setStyle(() => { return [] });
    game.layer.road.setStyle(() => { return [] });
  }
  if (!window.vectorLoader) {
    game.map.on('click', e => {
      const f = game.map.getFeaturesAtPixel(e.pixel);
      if (f.length) {
        const p = f[0].getProperties();
        delete p.geometry;
        delete p.bbox;
        Object.keys(p).forEach(k => {
          if (p[k]===null) delete p[k];
        })
        console.table(p)
      }
    })
    //
    window.vectorLoader = vectorLoader;
    window.mapInfo = mapInfo;
    // Open debug in a new window
    const win = window.open('', 'DEBUG', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no')
    win.document.title = 'DEBUG';
    const d = win.document.createElement('DIV');
    win.document.body.innerHTML = '';
    win.document.body.appendChild(d);
    vtlayer.getTarget().remove();
    vtlayer.setTarget(d);
    const target = element.create('DIV', {
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvent: 'none',
        borderRadius: '50%',
        background: 'rgba(255,0,0,.3)',
        width: '0px',
        height: '0px'
      },
      parent: d
    });
    vtlayer.set('targetDiv', target);
  }
}

const game = new Game;

export default game
