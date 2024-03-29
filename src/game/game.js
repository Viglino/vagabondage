import olObject from 'ol/Object'
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { getPointResolution, toLonLat } from 'ol/proj';
import { getDistance } from 'ol/sphere';
import element from 'ol-ext/util/element'

import 'ol-ext/render/Cspline'
import 'ol-ext/geom/GeomUtils'

import pages from '../page/pages'
import map, { infoControl, notification } from '../map/map';
import dialog, { info } from '../map/dialog';
import { clcInfo } from '../vectorLoader/mapLoader';
import vectorLoader from '../vectorLoader/vectorLoader';
import layer, { layerCarte } from '../map/layer'
import routing from '../map/routing';
import { getRegionNameByPos, getDepartementName } from '../vectorLoader/regions'
import gauge, { roadGauge } from './gauge'

import vtlayer from '../vectorLoader/vtMap'
import mapInfo from '../vectorLoader/mapInfo'
import _T from '../i18n/i18n'
import help from '../page/help'
import { getRandomStory } from './story'
import { formatDate, formatDuration, m2km } from '../page/utils';

import { getIntersection } from '../vectorLoader/bdtopo'

import ol_ext_Ajax from 'ol-ext/util/Ajax';
import showDialogInfo from '../page/dialogInfo'
import bag from './bag';

import { getCenter } from 'ol/extent';
import { layerHelp } from '../map/layer';

import './game.css'
import ol_control_Button from 'ol-ext/control/Button';
import helpInfo from './helpInfo';

document.body.dataset.disableMap = '';

/** Game object
 */
class Game extends olObject {
  constructor() {
    super();
    this.map = map
    // Life gauge
    this.gauge = gauge;
    map.addControl(this.gauge);
    this.compass = 5;
    // Road
    this.roadGauge = roadGauge;
    map.addControl(this.roadGauge);
    this.set('roads', 0);
    // Bag
    this.bag = bag;
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
    // help info
    helpInfo.create('carte', 'afficher / masquer la carte...')
  }
}

/** Fly to postion
 * @param {ol/Coordinate} position
 */
Game.prototype.flyTo = function(position) {
  this.map.getView().flyTo({
    center: position,
    zoom: Math.max(this.map.getView().getZoom(), 14)
    //zoomAt: Math.max(this.map.getView().getZoom() - .5, 13.01)
  })
}

/** Has shoes -1pt / 3km */
Game.prototype.setShoes = function() {
  this.set('shoes', true);
  this.map.addControl(new ol_control_Button({ 
    className: 'shoes',
    handleClick: () => notification.show(_T('shoes'))
  }));
}

/** Set current life value
 * @param {number|string} inc increase/decrease value
 */
Game.prototype.setLife = function(inc) {
  const nlife = this.getLife();
  // Increase hydro / food
  if (inc === 'hydro' || inc === 'food') {
    if (nlife < 0) {
      // when starving anything get +1
      inc = 1;
    } else if (this.gauge.get(inc)) {
      // Drink or eat
      this.gauge.set(inc, false);
      inc = 1;
    } else {
      inc = 0;
    }
    if (!inc) return 0;
  } else if (inc === -1) {
    // Loose hydro / food first
    if (!this.gauge.get('hydro')) this.gauge.set('hydro', true);
    else if (!this.gauge.get('food')) this.gauge.set('food', true);
  } else {
    if (nlife + (this.gauge.get('hydro') || 0) + (this.gauge.get('food') || 0) < 6) {
      inc = +1;
    } else {
      inc = 0;
      return 0;
    }
  }
  const n = nlife + inc;
  this.gauge.val(n+2);
  this.gauge.setTitle((n>0 ? '+':'')+n);
  this.gauge.element.classList.add('anim');
  setTimeout(() => this.gauge.element.classList.remove('anim'), 1000);
  return inc;
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
 * @param {string} level
 * @param {number} month
 */
Game.prototype.load = function(region, length, level, month) {
  this.story = getRandomStory();
  this.compass = level || 0;
  vectorLoader.loadGame({
    story: this.story, 
    region: region, 
    length: length
  }, g => {
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
      this.set('end', feature.getGeometry().getLastCoordinate());
      setTimeout(() => {
        layer.getSource().addFeature(new Feature({
          style: 'finish',
          geometry: new Point(this.get('end'))
        }));
      }, 100);
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
      // this.map.getView().setMinZoom(13.01);
      delete document.body.dataset.disableMap;
      this.begin();
    }
  })
}

/** Begin game
 */
Game.prototype.begin = function() {
  const info = this.get('startInfo')
  let intro = this.story.introduction;
  const year = (new Date).getFullYear();
  intro = intro.replace(/%year\+(\d+)%/, (st, a1) => year + parseFloat(a1))
  intro = intro.replace('%biome%', info.biome);
  intro = intro.replace('%distance%', m2km(this.get('tDistance')));
  if (info.roadClass && info.road) {
    intro = intro.replace('%routeInfo%', 'sur la ' + info.roadClass.toLocaleLowerCase() + ' ' + info.road);
  } else {
    intro = intro.replace('%routeInfo%', 'à côté de ' + info.commune);
  }
  showDialogInfo(intro, this.story, () => {
    // Show help
    help.show(() => {
      this.map.getView().animate({ zoom: 19.5 });
      this.getArround();
      setTimeout(() => {
        infoControl.element.classList.add('start');
        infoControl.element.classList.remove('start0');
        map.once('click', () => {
          infoControl.element.classList.remove('start');
          helpInfo.show('carte');
        })
      }, 500);
    });
  });
}

/** Goto next step
 */
Game.prototype.nextStep = function(e, shortcut) {
  // Crossing
  let error = false;
  if (e.crossing && !shortcut) {
    if (e.routing.distance > 250) {
      error = ['dist', _T('noCrossing:dist')];
    }
    if (e.deniv > 150) {
      error = ['alti', _T('noCrossing:alti') + ' (' + e.deniv.toFixed(0) + ' m)'];
    } 
    if (e.maxD > .35) {
      error = ['slop', _T('noCrossing:slop') + ' (' + (e.maxD * 100).toFixed(0) + '%)'];
    } 
    // Check intersections
    if (e.intersect.count) {
      error = getIntersection(e.intersect);
    }
  }

  // Show Error
  if (error) {
    const info = error[0]!=='water' ? (game.compass > 0) : false;
    const buttons = info ?  { ok: 'OK', cancel: 'annuler' } : { cancel: 'OK' };
    dialog.show({
      title: _T('noCrossing'),
      content: error[1] + (info ? '<br/>' + _T('noCrossing:info').replace('XX', game.compass) : ''),
      className: 'noCrossDlg',
      buttons: buttons,
      onButton: (b) => {
        // Use a shortcut ?
        if (b==='ok') {
          game.compass--;
          this.nextStep(e, true);
        }
      }
    });
    if (!info) this.routing_.setStart(e.start);
    return;
  }

  // Calculate life / dist
  this.dist = (this.dist || 0) + e.routing.distance * (e.crossing ? 2 : 1);
  const dm = this.get('shoes') ? 3000 : 2000;
  while (this.dist > dm) {
    this.setLife(-1);
    this.dist -= dm;
  }
  // Calculate distance / duration
  this.set('distance', (this.get('distance') || 0) + e.routing.distance);
  this.set('duration', (this.get('duration') || 0) + e.routing.duration/60);
  // Set new position
  const position = e.end;
  this.set('position', position);

  // Check ennemy along roads
  const along = this.getAlong(e.routing.feature, f => f.layer === 'troncon_de_route' && f.importance < 5);
  const roads = [];
  along.forEach(f => {
    switch (f.importance) {
      case "4": roads.push(f); break;
      case "3": roads.push(f); roads.push(f); break;
      default: roads.push(f); roads.push(f); roads.push(f); break;
    }
  })
  const nbRoads = this.get('roads') + roads.length;
  let altercation = false;
  const altTable = [ 100, 150, 200 ];
  altTable.forEach(alt => {
    if (this.get('roads') < alt && nbRoads >= alt) {
      const pos = roads[alt - this.get('roads') -1];
      layer.getSource().addFeature(new Feature({
        style: 'altercation',
        geometry: new Point(pos.coordinate)
      }));
      altercation = {
        type: (alt === altTable[altTable.length-1] ? 'fail' : 'missed'),
        coordinate: pos.coordinate
      };
      this.setLife(-1);
      // Center on altercation
      this.map.getView().animate({
        center: pos.coordinate,
        zoom: Math.max(17, this.map.getView().getZoom())
      })
    }
  })
  this.set('roads', nbRoads);
  this.roadGauge.val(nbRoads);

  // New destination
  this.set('destination', getDistance(toLonLat(this.get('position')), toLonLat(this.get('end'))))
  this.routing_.setStart(position);

  // Add features to the map
  e.routing.feature.set('style', 'route');
  layer.getSource().addFeature(e.routing.feature.clone());
  if (altercation.type !== 'fail') {
    layer.getSource().addFeature(new Feature({
      style: this.getLife() < -2 ? 'altercation' : 'poi',
      geometry: new Point(position)
    }));
  }
  e.routing.feature.set('style', 'routeMap');
  layerCarte.getSource().addFeature(e.routing.feature);

  // Get arround > encounter
  if (this.altercation(altercation)) return;
  this.map.getView().setCenter(position);
  this.getArround((arround) => this.encounter(arround));

  // Starving
  if (this.getLife() < -2) {
    dialog.show()
    this.finish(true);
    showDialogInfo(_T('starvation'), {}, () => {
      this.finish(true);
    })
  } else if (this.getLife() < -0) {
    showDialogInfo(_T('starving'));
  }
};

/** Get features along travel feature
 * @param {ol/Feature} feature
 * @returns
 */
Game.prototype.getAlong = function(feature, filter) {
  const res = getPointResolution(this.map.getView().getProjection(), 1, this.get('position'));
  const l = feature.getGeometry().sampleAt(10*res);
  const coords = l.getCoordinates();
  const sampleRoad = [];
  let prevPt = toLonLat(coords[0]);
  for (let i=1; i<coords.length; i++) {
    if (i===coords.length-1 || getDistance(prevPt, toLonLat(coords[i])) > 100) {
      const features = mapInfo.getFeaturesAtCoord(coords[i]);
      const r = this.findArround(filter, features);
      if (r) {
        sampleRoad.push(Object.assign({ coordinate: coords[i] }, r));
      }
      prevPt = toLonLat(coords[i]);
    }
  }
  return sampleRoad;
};

/** Get information arround current position
 */
Game.prototype.getArround = function(cback) {
  setTimeout(() => {
    const arround = mapInfo.getAround(20, this.get('position'));
    // Show status
    const road = this.findArround(f => f.layer === 'route_numerotee_ou_nommee', arround)
    const troncon = this.findArround(f => f.layer === 'troncon_de_route', arround)
    const zone = this.findArround(f => f.layer === 'zone_d_habitation', arround)
    const infos = {
      distance: (this.get('distance') ? formatDuration(this.get('duration')) +' (' + m2km(this.get('distance'), 1) +')' : ''),
      road: (road ?
          (road.nom || '') + (road.numero ? ' <span class="numero">' + road.numero + '</span> ' : ' ')
        : (troncon ? troncon.nature + '<br/>' : ''))
        + (zone ? zone.toponyme : '')
        +' <i class="fa fa-step-forward"></i> ' + m2km(this.get('destination'), 1),
      time: formatDate(new Date(this.get('date').getTime() + (this.get('duration')*60*1000)))
    }
    let status = '';
    for (let k in infos) {
      if (infos[k]) {
        status += '<p class="'+k+'">'+infos[k]+'</p>'
      }
    }
    infoControl.status(status);

    // Do something
    if (cback) cback(arround);
  });
};

Game.prototype.showAround = function() {
  const position = game.get('position');
  // Find features arround
  mapInfo.findAround(
    1000,
    position,
    (features) => {
      layerHelp.getSource().clear();
      const lonlat = toLonLat(position);
      // Get possible actions
      game.getActions(features).forEach((f) => {
        const c = getCenter(f.place.original.getExtent())
        if (getDistance(toLonLat(c), lonlat) < 1500) {
          const type = f.info.actions[0][0].type;
          // console.log(Array.isArray(type) ? type[0] : type)
          layerHelp.getSource().addFeature(new Feature({
            title: f.info.title,
            type: Array.isArray(type) ? type[0] : type,
            geometry: new Point(c)
          }))
        }
      })
      try {
        this.map.getView().fit(layerHelp.getSource().getExtent());
        if (this.map.getView().getZoom() > 16) this.map.getView().setZoom(16)
      } catch(e) {
        return;
      }
      this.compass--;
    }
  )
}

/** Find something arround
 * @param {function} filter
 */
Game.prototype.findArround = function(filter, arround) {
  for (let k in arround) {
    const f = arround[k].find(filter);
    if (f) return f;
  }
}

/** Handle encounter */
Game.prototype.encounter = function(arround) {
  // This is the end?
  if (this.get('destination') < 15) {
    this.finish();
    return true;
  }
  this.arround = arround;

  // Show what's arround
  this.dispatchEvent({ type: 'arround' });

  /* DEBUG: Show table info */
  const tInfo = {};
  for (let k in arround) {
    arround[k].forEach((a,i) => {
      tInfo[a.layer+'-'+i] = {
        nature: a.nature || '-',
        toponyme: a.toponyme || a.nom || a.numero || a.cpx_numero || '-'
      }
    });
  }
  console.table(tInfo);
  /**/
}

/** Handle altercation */
Game.prototype.altercation = function(altercation) {
  if (altercation) {
    const arround = mapInfo.getAround(20, altercation.coordinate);
    let hide;
    if (arround['zone_de_vegetation-Haie']) {
      hide = _T('hide:hedge')
    } else if (this.findArround(f => f.layer === 'zone_de_vegetation', arround)) {
      hide = _T('hide:veget');
    } else {
      hide = _T('hide:arround');
    }
    const content = this.story[altercation.type].replace('%hiddingPlace%', hide);
    showDialogInfo(content, {}, () => {
      if (altercation.type === 'fail') {
        this.finish(true);
        this.routing_.setStart([]);
        return true;
      }
    })
  }
  return false;
};

/** Finish game
 * @param {boolean} fail
 */
Game.prototype.finish = function(fail) {
  function reload() {
    console.log('reload')
    element.create('DIV', {
      className: 'reload',
      text: _T('reload'),
      click: () => location.reload(),
      parent: document.body
    })
  }
  // Finish
  this.routing_.setActive(false);
  if (fail) {
    dialog.show({
      title: _T('end:fail'),
      className: 'failDialog',
      content: '',
      buttons: [ _T('close') ]
    })
    dialog.once('close', reload)
  } else {
    showDialogInfo(this.story.conclusion, {}, () => {
      dialog.show({
        title: _T('end:win'),
        className: 'winDialog',
        content: '',
        buttons: [ _T('close') ],
        onButton: reload
      })
      dialog.once('close', reload)
    })
  }
};

/** Switch debug mode
 * @param {boolean} b
 */
Game.prototype.debug = function(b) {
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
    // DEBUG
    window.vectorLoader = vectorLoader;
    window.mapInfo = mapInfo;
    // Open debug in a new window
    const win = window.open('', 'DEBUG', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=1024,height=1024')
    win.document.title = 'DEBUG';
    
    const d = win.document.createElement('DIV');
    d.style.width = vtlayer.getTarget().style.width;
    d.style.height = vtlayer.getTarget().style.height;
    d.style.position = 'fixed';
    d.style.top = '50%';
    d.style.left = '50%';
    d.style.transform = 'translate(-50%, -50%)';

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
