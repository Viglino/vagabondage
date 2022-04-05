import PointerInteraction from 'ol/interaction/Pointer';

import map from './map'
import vector, { layerCarte } from './layer'
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import vectorLoader from '../vectorLoader/vectorLoader';

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

import { getDistance } from 'ol/sphere'
import { toLonLat } from 'ol/proj';
/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Map browser event.
 */
 Drag.prototype.handleDragEvent = function(evt) {
  const d = getDistance(toLonLat(this.start_), toLonLat(evt.coordinate));
  // Less than 2km?
  if (d > 2000) return;

  this.coordinate_[0] = evt.coordinate[0];
  this.coordinate_[1] = evt.coordinate[1];
  this.feature_.getGeometry().setCoordinates(this.coordinate_);

  // Show route
  if (this.tout_) clearTimeout(this.tout_);
  this.tout_ = setTimeout(() => this.showRouting(this.start_, this.coordinate_, this.route_), 300);
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
      if (element.style.cursor != this.cursor_) {
        this.previousCursor_ = element.style.cursor;
        element.style.cursor = this.cursor_;
      }
    } else if (this.previousCursor_ !== undefined) {
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

/**
 * @return {boolean} `false` to stop the drag sequence.
 */
Drag.prototype.handleUpEvent = function() {
  if (this.tout_) clearTimeout(this.tout_);
  this.showRouting(this.start_, this.coordinate_, this.route_, this.feature_)
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
