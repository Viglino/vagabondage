import PointerInteraction from 'ol/interaction/Pointer';

import map from './map'
import vector, { debug } from './layer'
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import vectorLoader from '../vectorLoader/vectorLoader';
import { getDistance, getLength } from 'ol/sphere'
import { toLonLat } from 'ol/proj';
import { platformModifierKeyOnly } from 'ol/events/condition' 
import { boundingExtent } from 'ol/extent';

import Tooltip from 'ol-ext/overlay/Tooltip'
import _T from '../i18n/i18n'
import { vtLoader } from '../vectorLoader/vtMap';
import Ajax from 'ol-ext/util/Ajax';
import dialog from './dialog';

// Max distance:  1.5km
const maxDist = 1500;
// Max crossing distance: 500m
const maxCross = 500;

const tooltip = new Tooltip({
  offsetBox: [15, 0]
});
map.addOverlay(tooltip);

/**
 * 
 */
class Drag extends PointerInteraction {
  constructor(options) {
    options = options || {};
    super({
      handleDownEvent: Drag.prototype.handleDownEvent,
      handleDragEvent: Drag.prototype.handleDragEvent,
      handleMoveEvent: Drag.prototype.handleMoveEvent,
      handleUpEvent: Drag.prototype.handleUpEvent,
    });

    this.coordinate_ = null;
    this.cursor_ = 'move';
    this.previousCursor_ = undefined;

    this.layer_ = options.layer;
    this.routeTmp_ = options.route;
    this.route_ = this.routeTmp_.clone();
    this.layer_.getSource().addFeature(this.route_);

    // Start point
    this.feature_ = new Feature({
      type: 'start',
      geometry: new Point([])
    })
    this.layer_.getSource().addFeature(this.feature_);
  }
}

/** Activate / deactivate interaction
 * @param {boolean} b
 */
Drag.prototype.setActive = function(b) {
  PointerInteraction.prototype.setActive.call(this, b);
  if (this.previousCursor_ !== undefined) {
    const element = this.getMap().getTargetElement();
    element.style.cursor = this.previousCursor_;
    this.previousCursor_ = undefined;
  }
  tooltip.setInfo('')
}

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Map browser event.
 * @return {boolean} `true` to start the drag sequence.
 */
Drag.prototype.handleDownEvent = function(evt) {
  if (document.body.dataset.mode === 'carte') return;

  const feature = this.hasFeatureAt(evt.pixel);
  if (feature) {
    this.coordinate_ = evt.coordinate;
    this.feature_ = feature;
    this.start_ = feature.getGeometry().getCoordinates();
  }
  return !!feature;
}

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Map browser event.
 */
Drag.prototype.handleDragEvent = function(evt) {
  if (this.tout_) clearTimeout(this.tout_);
  // Too long stage
  const d = getDistance(toLonLat(this.start_), toLonLat(evt.coordinate));
  if (d > maxDist || (platformModifierKeyOnly(evt) && d > maxCross)) {
    tooltip.setInfo(_T('longStage'));
    this.route_.getGeometry().setCoordinates([]);
    this.coordinate_ = null;
    this.feature_.getGeometry().setCoordinates(this.start_);
    return;
  }
  this.cross_ = false;
  // Alt key pressed
  if (platformModifierKeyOnly(evt)) {
    // Get clossest road
    vtLoader.getFeaturesAt(evt.coordinate, { filter: 'troncon_de_route', tolerance: 10 }, (f) => {
      const feature = vtLoader.vtFeature(f[0]);
      if (feature) {
        const cpoint = feature.getGeometry().getClosestPoint(evt.coordinate);
        this.coordinate_ = cpoint;
        this.route_.getGeometry().setCoordinates([this.start_, this.coordinate_]);
        this.cross_ = true;
      } else {
        this.route_.getGeometry().setCoordinates([]);
        this.coordinate_ = null;
        this.feature_.getGeometry().setCoordinates(this.start_);
      }
      tooltip.setInfo(_T('crossThrough'))
    })
  } else {
    // Get routing
    tooltip.setInfo(_T('goTo'))
  
    this.coordinate_ = [
      evt.coordinate[0],
      evt.coordinate[1]
    ];
    this.feature_.getGeometry().setCoordinates(this.coordinate_);
  
    // Show route
    this.tout_ = setTimeout(() => this.showRouting(this.start_, this.coordinate_, this.route_), 300);
  }
};

/** Get 
 * 
 */
Drag.prototype.hasFeatureAt = function(pixel) {
   if (!this.getActive()) return false;
  const feature = map.forEachFeatureAtPixel(pixel, feature => { 
    return (feature === this.feature_ ? feature : false);
  }, {
    layerFilter: l => { return l === this.layer_; }
  });
  return feature;
}

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Event.
 */
Drag.prototype.handleMoveEvent = function(evt) {
  if (this.cursor_) {
    const feature = this.hasFeatureAt(evt.pixel);
    const element = evt.map.getTargetElement();
    if (feature && document.body.dataset.mode !== 'carte') {
      if (element.style.cursor !== this.cursor_) {
        tooltip.setInfo(_T('movePoint'));
        this.previousCursor_ = element.style.cursor;
        element.style.cursor = this.cursor_;
      }
    } else if (this.previousCursor_ !== undefined) {
      tooltip.setInfo('')
      element.style.cursor = this.previousCursor_;
      this.previousCursor_ = undefined;
    } else {
      tooltip.setInfo('')
    }
  } else {
    tooltip.setInfo('')
  }
}

/** Show routing
 * @param {ol/Coordinate} start
 * @param {ol/Coordinate} end
 * @param {Feature} route current route
 * @param {boolean} go
 */
Drag.prototype.showRouting = function(start, end, route, go) {
  vectorLoader.getRouting(start, end, resp => {
    if (go) {
      const pt = resp.feature.getGeometry().getCoordinates().pop();
      route.getGeometry().setCoordinates([]);
      this.dispatchEvent({
        type: 'routing',
        start: start,
        end: pt,
        routing: resp
      })
    } else {
      route.setGeometry(resp.feature.getGeometry());
    }
  })
}

/** Intersect 2 segments */
const intersectSegs = function (d1, d2)	{
  var d1x = d1[1][0] - d1[0][0];
  var d1y = d1[1][1] - d1[0][1];
  var d2x = d2[1][0] - d2[0][0];
  var d2y = d2[1][1] - d2[0][1];
  var det = d1x * d2y - d1y * d2x;

  if (det != 0) {
    var k1 =  (d1x * d1[0][1] - d1x * d2[0][1] - d1y * d1[0][0] + d1y * d2[0][0]) / det;
    var k2 = -(d2x * d2[0][1] - d2x * d1[0][1] - d2y * d2[0][0] + d2y * d1[0][0]) / det;
    // Intersection: return [d2[0][0] + k*d2x, d2[0][1] + k*d2y];
    return (0<=k1 && k1<=1 && 0<=k2 && k2<=1);
  } else {
    return false;
  }
};

/** Intersect feature with a segment
 *
 */
const intersectFeature = function(f, d) {
  if (/Line|Polygon/.test(f.getGeometry().getType())) {
    let geom;
    switch(f.getGeometry().getType()) {
      case 'LineString': {
        geom = f.getGeometry().getCoordinates();
        break;
      }
      case 'Polygon': {
        geom = f.getGeometry().getCoordinates()[0];
        break;
      }
      case 'MultiPolygon': {
        geom = f.getGeometry().getCoordinates()[0][0];
        break;
      }
    }
    if (geom) {
      for (let i=1; i<geom.length; i++) {
        if (intersectSegs(d, [geom[i-1], geom[i]])) {
          return true;
        }
      }
    }
  }
  return false;
}

/** Set starting point */
Drag.prototype.setStart = function(pt) {
  this.feature_.getGeometry().setCoordinates(pt);
};

/** Check cross road
 * @param {ol/Coordinate} start
 * @param {ol/Coordinate} end
 * @param {ol/Feature} route route feature
 * @param {ol/Feature} feature user position
 */
Drag.prototype.checkCross = function(start, end, route) {
  dialog.show({
    className: 'wait',
    content: _T('crossThrough')
  })
  const extent = boundingExtent([start,end])
  route = route.clone();
  route.getGeometry().setCoordinates([start, end]);
  const seg = [start, end];
  vtLoader.getFeaturesInExtent(extent, {}, features => {
    features = vtLoader.vtFeatures(features);
    // Get (interesting) features intersecting segment
    const intersect = { count: 0, barrier: {}, feature: {}, infos: {}, bridge: false };
    features.forEach(f => {
      if (intersectFeature(f, seg)) {
        const layer = f.get('layer');
        switch (layer) {
          // Barrier features
          case 'ligne_orographique': {
            if (!intersect.barrier[layer]) intersect.barrier[layer] = [];
            intersect.barrier[layer].push(f);
            break;
          }
          // has feature
          case 'batiment':
          case 'surface_hydrographique':
          case 'troncon_de_voie_ferree': {
            intersect.feature[layer] = f;
            break;
          }
          // special features / prop
          case 'construction_lineaire': {
            console.log(f.getProperties())
            if (/pont/i.test(f.get('nature'))) intersect.bridge = f;
            break;
          }
          case 'troncon_hydrographique': {
            if (/intermittent/i.test(f.get('persistance'))) intersect.infos[layer] = f;
            else intersect.feature[layer] = f;
            break;
          }
          case 'troncon_de_route': {
            if (/autorout/i.test(f.get('nature'))) intersect.feature[layer] = f;
            else intersect.infos[layer] = f;
            break;
          }
        }
      }
    })
    intersect.count = Object.keys(intersect.feature).length;
    /* DEBUG */
    debug.getSource().clear();
    for (let i in intersect) {
      if (intersect[i].getGeometry) {
        debug.getSource().addFeature(intersect[i])
        intersectFeature(intersect[i], seg)
      }
    }
    /* */
    const dist = getLength(route.getGeometry());
    this.getElevation([start, end], Math.min(100, Math.round(dist/10)), r => {
      let deniv = 0;
      let maxD = 0;
      if (r.elevations) {
        const ele = r.elevations;
        for (let i=1; i<ele.length; i++) {
          const d = Math.abs(ele[i-1].z - ele[i].z);
          const dist = getDistance([ele[i-1].lon, ele[i-1].lat], [ele[i].lon, ele[i].lat]);
          deniv += d;
          if (dist > 9) maxD = Math.max(maxD, d / dist)
        }
      }
      dialog.hide();
      this.dispatchEvent({
        type: 'routing',
        crossing: true,
        intersect: intersect,
        start: start,
        end: end,
        elevation: r.elevations,
        deniv: deniv,
        maxD: maxD,
        routing: {
          feature: route,
          distance: dist,     // disance in m
          duration: dist / 50 // duration in mn (3km/h = 50m/mn)
        }
      })      
    });
  })
}

/** Get elevation
 * @param {Array<ol/Coordinate>} pts
 * @param {function} cback
 */
Drag.prototype.getElevation = function(pts, sampling, cback) {
  const lon= [], lat =[];
  pts.forEach(p => {
    p = toLonLat(p);
    lon.push(p[0]);
    lat.push(p[1]);
  });
  const url = 'https://wxs.ign.fr/essentiels/alti/rest/elevationLine.json?sampling=' + sampling
    + '&lon=' + lon.join('|')
    + '&lat=' + lat.join('|');
  Ajax.get({
    url: url,
    success: cback,
    error: cback
  })
};

/**
 * @return {boolean} `false` to stop the drag sequence.
 */
Drag.prototype.handleUpEvent = function() {
  if (!this.coordinate_) return;
  if (this.tout_) clearTimeout(this.tout_);
  if (this.cross_) {
    this.checkCross(this.start_, this.coordinate_, this.route_);
    this.route_.getGeometry().setCoordinates([]);
  } else {
    const d = getDistance(toLonLat(this.start_), toLonLat(this.coordinate_));
    // Toolong
    if (d > maxDist) return;
    // Go there
    this.showRouting(this.start_, this.coordinate_, this.route_, true)
  }
  // this.route_ = this.routeTmp_.clone();
  // this.layer_.getSource().addFeature(this.route_);
  this.coordinate_ = null;
  return false;
}

// Template for the routes
const route = new Feature({
  type: 'route',
  style: 'route',
  geometry: new LineString([])
});

const routing = new Drag({
  layer: vector,
  route: route
});
map.addInteraction(routing);

export default routing
