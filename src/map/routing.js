import PointerInteraction from 'ol/interaction/Pointer';

import map from './map'
import vector, { debug } from './layer'
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import vectorLoader from '../vectorLoader/vectorLoader';
import { getDistance } from 'ol/sphere'
import { toLonLat } from 'ol/proj';
import { platformModifierKeyOnly } from 'ol/events/condition' 

import Tooltip from 'ol-ext/overlay/Tooltip'
import _T from '../i18n/i18n'
import { vtLoader } from '../vectorLoader/vtMap';
import { boundingExtent } from 'ol/extent';

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
    this.feature_ = null;
    this.previousCursor_ = undefined;

    this.layer_ = options.layer;
    this.routeTmp_ = options.route;
    this.route_ = this.routeTmp_.clone();
    this.layer_.getSource().addFeature(this.route_);
  }
}

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Map browser event.
 * @return {boolean} `true` to start the drag sequence.
 */
Drag.prototype.handleDownEvent = function(evt) {
  if (document.body.dataset.mode === 'carte') return;

  const feature = getFeatureAt(evt.map, evt.pixel, this.layer_)
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
function getFeatureAt (map, pixel, layer) {
  const feature = map.forEachFeatureAtPixel(pixel, feature => { 
    return (feature.get('type') === 'start' ? feature : false);
  }, {
    layerFilter: l => { return l===layer; }
  });
  return feature;
}

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Event.
 */
Drag.prototype.handleMoveEvent = function(evt) {
  if (this.cursor_) {
    const feature = getFeatureAt(evt.map, evt.pixel, this.layer_);
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
    }
  }
}

/** Show routing
 * @param {ol/Coordinate} start
 * @param {ol/Coordinate} end
 * @param {Feature} route current route
 * @param {Feature} feature new feature to create
 */
Drag.prototype.showRouting = function(start, end, route, feature) {
  vectorLoader.getRouting(start, end, resp => {
    if (feature) {
      const pt = resp.feature.getGeometry().getCoordinates().pop();
      feature.getGeometry().setCoordinates(pt);
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


/** Check cross road
 * @param {ol/Coordinate} start
 * @param {ol/Coordinate} end
 * @param {ol/Feature} route route feature
 * @param {ol/Feature} feature user position
 */

Drag.prototype.checkCross = function(start, end, route, feature) {
  const extent = boundingExtent([start,end])
  route = route.clone();
  route.getGeometry().setCoordinates([start, end]);
  const seg = [start, end];
  vtLoader.getFeaturesInExtent(extent, {}, features => {
    features = vtLoader.vtFeatures(features);
    // Get features intersecting segment
    const intersect = {};
    features.forEach(f => {
      if (intersectFeature(f, seg)) {
        const layer = f.get('layer');
        switch (layer) {
          case 'ligne_orographique': {
            if (!intersect[layer]) intersect[layer] = [];
            intersect[layer].push(f);
            break;
          }
          case 'troncon_de_voie_ferree': {
            intersect[layer] = f;
            break;
          }
          case 'surface_hydrographique': {
            intersect[layer] = f;
          }
          case 'troncon_hydrographique': {
            if (f.get('persistance') !== '') intersect[layer] = f;
            break;
          }
          case 'troncon_de_route': {
            if (/autorout/i.test(f.get('nature'))) intersect[layer] = f;
            break;
          }
        }
      }
    })
    console.log('INTERSEC:', features, intersect);
    debug.getSource().clear();
    for (let i in intersect) {
      if (intersect[i].getGeometry) {
        console.log(i);
        debug.getSource().addFeature(intersect[i])
        intersectFeature(intersect[i], seg)
      }
    }
    feature.getGeometry().setCoordinates(end);
    this.dispatchEvent({
      type: 'routing',
      start: start,
      end: end,
      routing: {
        feature: route
      }
    })
    feature.getGeometry().setCoordinates(end);
  })
}

/**
 * @return {boolean} `false` to stop the drag sequence.
 */
Drag.prototype.handleUpEvent = function() {
  if (!this.coordinate_) return;
  if (this.tout_) clearTimeout(this.tout_);
  if (this.cross_) {
    this.checkCross(this.start_, this.coordinate_, this.route_, this.feature_);
    this.route_.getGeometry().setCoordinates([]);
  } else {
    const d = getDistance(toLonLat(this.start_), toLonLat(this.coordinate_));
    // Toolong
    if (d > maxDist) return;
    // Go there
    this.showRouting(this.start_, this.coordinate_, this.route_, this.feature_)
  }
  // this.route_ = this.routeTmp_.clone();
  // this.layer_.getSource().addFeature(this.route_);
  this.coordinate_ = null;
  this.feature_ = null;
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
