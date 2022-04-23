import olObject from 'ol/Object'
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { toLonLat } from 'ol/proj';
import { getDistance } from 'ol/sphere';
import element from 'ol-ext/util/element'
import Gauge from 'ol-ext/control/Gauge'
import 'ol-ext/render/Cspline'

import pages from '../page/pages'
import map, { infoControl } from '../map/map';
import dialog, { info } from '../map/dialog';
import { clcInfo } from '../vectorLoader/mapLoader';
import vectorLoader from '../vectorLoader/vectorLoader';
import layer, { layerCarte } from '../map/layer'
import routing from '../map/routing';
import { getRegionNameByPos, getDepartementName } from '../vectorLoader/regions'

import vtlayer from '../vectorLoader/vtMap'
import mapInfo from '../vectorLoader/mapInfo'
import _T from '../i18n/i18n'
import help from '../page/help'
import { getRandomStory } from './story'
import { formatDate, m2km } from '../page/utils';

import ol_ext_Ajax from 'ol-ext/util/Ajax';
import showDialogInfo from '../page/dialogInfo'

import './game.css'

document.body.dataset.disableMap = '';

/** Game object
 */
class Game extends olObject {
  constructor() {
    super();
    this.map = map
    // Life gauge
    this.gauge = new Gauge({
      title: '+6', 
      max: 8,
      val: 8
    });
    map.addControl(this.gauge);
    // Show destination / 
    const d = element.create('UL', {
      className: 'jumper',
      parent: document.body
    })
    element.create('LI', {
      html: '<i class="fg-position"></i> Ta position',
      click: () => this.flyTo(this.get('position')),
      parent: d
    })
    element.create('LI', {
      html: '<i class="fg-location-arrow"></i> Ta destination',
      click: () => this.flyTo(this.get('end')),
      parent: d
    })
    element.create('LI', {
      html: '<i class="fg-map-legend"></i> Legende',
      click: () => pages.showLegend(),
      parent: d
    })
    // Goto next step on walk
    this.routing_ = routing;
    routing.on('routing', e => this.nextStep(e));
    /** /
    // Add layers
    this.layer = {
      zai: new VectorLayer({
        title: 'zai',
        source: vectorLoader.source.zai,
        minZoom: 15,
        style: []
      }),
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
    for (let l in this.layer) {
      this.map.addLayer(this.layer[l]);
    }
    /**/
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

/** Set current life value
 * @param {number} n
 */
Game.prototype.setLife = function(n) {
  this.gauge.val(n+2);
  this.gauge.setTitle((n>0 ? '+':'')+n);
  this.gauge.element.classList.add('anim');
  setTimeout(() => this.gauge.element.classList.remove('anim'), 1000);
}

/** Get current life value
 * @returns {number}
 */
Game.prototype.getLife = function() {
  return this.gauge.val() - 2;
};

/** Set current status
 * Debug
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

/** Load a new game 
 * @param {string} region region id
 * @param {number} length travel length (in meter)
 * @param {number} month
 */
Game.prototype.load = function(region, length, month) {
  this.story = getRandomStory();
  vectorLoader.loadGame(region, length, g => {
    for (let i in g) this.set(i, g[i]);
    this.set('position', this.get('start'));
    this.set('destination', getDistance(toLonLat(this.get('position')), toLonLat(this.get('end'))));
    this.set('date', new Date());
    this.set('distance', 0);
    this.set('duration', 0);
    // Get commune / start info
    const startInfo = {
      region: getRegionNameByPos(region),
      road: g.road.get('cpx_numero'),
      roadClass: g.road.get('cpx_classement_administratif'),
      roadNature: g.road.get('nature'),
      clc: g.land.get('code_18'),
      paysage: clcInfo[g.land.get('code_18')].title,
      biome: clcInfo[g.land.get('code_18')].biome
    }
    this.set('startInfo', startInfo);
    const pos = toLonLat(g.start);
    ol_ext_Ajax.get({
      url: 'https://geo.api.gouv.fr/communes?lon=' + pos[0] + '&lat=' + pos[1],
      success: (r => {
        if (r.length) {
          startInfo.commune = r[0].nom;
          startInfo.pop = r[0].population;
          startInfo.idDep = r[0].codeDepartement;
          startInfo.region = getRegionNameByPos(region);
          startInfo.departement = getDepartementName(r[0].codeDepartement);
        }
      })
    })
    // Status
    const status = this.getStatus(g.road, g.land);
    //layer.getSource().addFeature(g.road);
    this.routing_.setStart(g.start);
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
      // layer.getSource().addFeature(result.feature);
      const feature = result.feature.clone();
      feature.set('style', 'travel');
      const l = feature.getGeometry().getLength();
      feature.setGeometry(feature.getGeometry().simplify(l/20).cspline({ pointsPerSeg: l/100 }));
      layerCarte.getSource().addFeature(feature);
      status['distance'] = (result.distance/1000).toFixed(1)+' km';
      const h = Math.floor(result.duration / 60)
      status['temps estimé'] = h+'h'+('0'+Math.floor(result.duration-h*60)).substr(-2);
      info.status(status);
      // Total distance / duration
      this.set('tDistance', result.distance);
      this.set('tDuration', result.duration);
      // Start
      dialog.hide();
      this.start();
    });

    // Set center
    layerCarte.getSource().addFeature(new Feature({
      style: 'start',
      geometry: new Point(g.start)
    }));
  })
}

/** Start a new game
 */
Game.prototype.start = function() {
  // Remove loader
  vectorLoader.setActive([]);
  // Zoom to start
  this.map.getView().takeTour([{
    type: 'flyTo', 
    center: this.get('start'),
    zoom: 19,
    zoomAt: map.getView().getZoom() - .1
  }], {
    done: () => {
      this.map.getView().setMinZoom(13.01);
      delete document.body.dataset.disableMap;
      this.begin();
    }
  })
}

/** Begin game
 */
Game.prototype.begin = function() {
  console.log('BEGIN', this.getProperties());
  const info = this.get('startInfo')
  let intro = this.story.introduction.replace(/\n/g, '<br/>');
  intro = intro.replace('%biome%', info.biome);
  intro = intro.replace('%distance%', m2km(this.get('tDistance')));
  if (info.roadClass && info.road) {
    intro = intro.replace('%routeInfo%', 'sur la ' + info.roadClass.toLocaleLowerCase() + ' ' + info.road);
  } else {
    intro = intro.replace('%routeInfo%', 'à côté de ' + info.commune);
  }
  intro = intro.split('<>');
  showDialogInfo(intro, this.story.title, () => {
    // Show help
    help.show('main').then(() => {
      this.map.getView().animate({ zoom: 19.5 });
      this.getArround();
      setTimeout(() => {
        infoControl.element.classList.add('start');
        infoControl.element.classList.remove('start0');
        map.once('click', () => infoControl.element.classList.remove('start'));
      }, 500);
    });
  });
}

/** Goto next step
 */
Game.prototype.nextStep = function(e) {
  // Crossing
  if (e.crossing) {
    let error = '';
    if (e.distance > 100) {
      error = _T('noCrossing:dist');
    }
    if (e.deniv > 150) {
      error = _T('noCrossing:alti') + ' (' + e.deniv.toFixed(0) + ' m)';
    } 
    if (e.maxD > .35) {
      error = _T('noCrossing:slop') + ' (' + (e.maxD * 100).toFixed(0) + '%)';
    } 
    // Check intersections
    if (e.intersect.count) {
      if (e.intersect.feature.troncon_de_route) {
        error = _T('noCrossing:road');
      } else if (e.intersect.feature.batiment) {
        error = _T('noCrossing:building');
      } else if (e.intersect.feature.surface_hydrographique || e.intersect.feature.troncon_hydrographique) {
        error = _T('noCrossing:river');
      } else if (e.intersect.feature.troncon_de_voie_ferree) {
        error = _T('noCrossing:rail');
      }  
    }
    // Show Error
    if (error) {
      dialog.show({
        title: 'Impossible de traverser ici !',
        content: error,
        className: 'noCrossDlg',
        buttons: { ok: 'OK' }
      });
      this.routing_.setStart(e.start);
      return;
    }
  }
  // Calculate life / dist
  this.dist = (this.dist || 0) + e.routing.distance;
  while (this.dist > 2000) {
    this.setLife(this.getLife()-1);
    this.dist -= 2000;
  }
  // Calculate distance / duration
  this.set('distance', (this.get('distance') || 0) + e.routing.distance);
  this.set('duration', (this.get('duration') || 0) + e.routing.duration);
  // Set new position
  const position = e.end;
  this.set('position', position);
  this.set('destination', getDistance(toLonLat(this.get('position')), toLonLat(this.get('end'))))
  this.routing_.setStart(position);
  // Add features to the map
  e.routing.feature.set('style', 'route');
  layer.getSource().addFeature(e.routing.feature);
  layer.getSource().addFeature(new Feature({
    style: 'poi',
    geometry: new Point(position)
  }));
  layerCarte.getSource().addFeature(e.routing.feature);
  // Get arround
  this.map.getView().setCenter(position);
  this.getArround();
}

/** Get information arround current position
 */
Game.prototype.getArround = function(cback) {
  setTimeout(() => {
    this.arround = mapInfo.getAround(20, this.get('position'));
    console.table(this.arround)
    if (cback) cback(this.arround);
    // this.
    const road = this.findArround(f => f.layer === 'route_numerotee_ou_nommee')
    const troncon = this.findArround(f => f.layer === 'troncon_de_route')
    const zone = this.findArround(f => f.layer === 'zone_d_habitation')
    const infos = {
      road: (road ? road.nom || road.type_de_route + ' <span class="numero">' + road.numero + '</span>' : (troncon ? troncon.nature + '<br/>' : ''))
        + (zone ? ' ' + zone.nature + ' : ' + zone.toponyme : ''),
      distance: (this.get('distance') ? 'Distance parcourue : ' + m2km(this.get('distance'), 1) : ''),
      rdv: 'Lieu de rendez-vous : ' + m2km(this.get('destination'), 1),
      time: formatDate(new Date(this.get('date').getTime() + (this.get('duration')*60*1000)))
    }
    let status = '';
    for (let k in infos) {
      if (infos[k]) {
        status += '<p class="'+k+'">'+infos[k]+'</p>'
      }
    }
    infoControl.status(status);
  });
};

/** Find something arround
 * @param {function} filter
 */
Game.prototype.findArround = function(filter) {
  for (let k in this.arround) {
    const f = this.arround[k].find(filter);
    if (f) return f;
  }
}

/** Set debug mode
 * @param {boolean} b
 */
Game.prototype.debug = function(b) {
  // Switch debug mode
  /*
  if (b) {
    document.body.dataset.debug = '';
    this.layer.zai.setStyle(redStyle);
    this.layer.building.setStyle();
    this.layer.road.setStyle();
  } else {
    delete document.body.dataset.debug;
    this.layer.zai.setStyle(() => { return [] });
    this.layer.building.setStyle(() => { return [] });
    this.layer.road.setStyle(() => { return [] });
  }
  */
  if (!window.vectorLoader) {
    this.map.addControl(info);
    this.map.on('click', e => {
      const f = this.map.getFeaturesAtPixel(e.pixel);
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
        pointerEvents: 'none',
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
