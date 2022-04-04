import PointerInteraction from 'ol/interaction/Pointer';
import Hover from 'ol-ext/interaction/Hover'

import map from './map'
import vector from './layer'
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
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleMoveEvent: handleMoveEvent,
      handleUpEvent: handleUpEvent,
    });

    /**
     * @type {import("../src/ol/coordinate.js").Coordinate}
     * @private
     */
    this.coordinate_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.cursor_ = 'move';

    /**
     * @type {Feature}
     * @private
     */
    this.feature_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.previousCursor_ = undefined;

    this.layer_ = options.layer;
    this.route_ = options.route;
  }
}

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Map browser event.
 * @return {boolean} `true` to start the drag sequence.
 */
 function handleDownEvent(evt) {
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
function handleDragEvent(evt) {
  this.coordinate_[0] = evt.coordinate[0];
  this.coordinate_[1] = evt.coordinate[1];
  this.feature_.getGeometry().setCoordinates(this.coordinate_);

  if (this.tout_) clearTimeout(this.tout_);
  this.tout_ = setTimeout(() => showRouting(this.start_, this.coordinate_, this.route_, this.feature_), 300);
}

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
function handleMoveEvent(evt) {
  if (this.cursor_) {
    const feature = getFeatureAt(evt.map, evt.pixel, this.layer_);
    const element = evt.map.getTargetElement();
    if (feature) {
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

function showRouting(start, end, route, feature) {
  vectorLoader.getRouting(start, end, resp => {
    route.setGeometry(resp.feature.getGeometry());
    if (feature) {
      const pt = resp.feature.getGeometry().getCoordinates().pop();
      feature.getGeometry().setCoordinates(pt);
    }
  })
}

/**
 * @return {boolean} `false` to stop the drag sequence.
 */
function handleUpEvent() {
  if (this.tout_) clearTimeout(this.tout_);
  showRouting(this.start_, this.coordinate_, this.route_, this.feature_)
  this.coordinate_ = null;
  this.feature_ = null;
  return false;
}

/*
map.addInteraction(new Hover({
  layerFilter: vector,
  featureFilter: f => { 
    return f.get('type') === 'start';
  },
  cursor: 'move'
}))
*/

const route = new Feature({
  type: 'route',
  geometry: new LineString([])
})
vector.getSource().addFeature(route)
map.addInteraction(new Drag({
  layer: vector,
  route: route
}))