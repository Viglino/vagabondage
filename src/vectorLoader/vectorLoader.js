import olObject from 'ol/Object'
import { buffer, boundingExtent } from 'ol/extent';
import dialog from '../map/dialog';

import mapLoader from './mapLoader';
import { sources, layers } from './vectorData';
import regions from './regions';

const vectorLoader = new olObject();

vectorLoader.map = mapLoader;

// Handle load
let toload = 0;
let maxload = 0;
Object.keys(sources).forEach(k => {
  sources[k].on('tileloadstart', () => {
    toload++;
    maxload++;
    vectorLoader.dispatchEvent({ type: 'loading', nb: maxload - toload, max: maxload });
  });
})
Object.keys(sources).forEach(k => {
  sources[k].on(['tileloadend', 'tileloaderror'], () => {
    toload--;
    vectorLoader.dispatchEvent({ type: 'loading', nb: maxload - toload, max: maxload });
    if (toload===0) {
      setTimeout(() => vectorLoader.dispatchEvent('ready'));
      maxload = 0;
    }
  })
})
/** Is ready to  */
function checkReady() {
  setTimeout(() => {
    if (toload===0) {
      vectorLoader.dispatchEvent('ready');
    }
  })
}

vectorLoader.source = sources;
vectorLoader.layer = layers;

/** Get random point inside polygon
 * @param {ol/geom/Polygon} g
 * @return {ol/coordinate}
 */
function getCoordinateInside(g) {
  const extent = g.getExtent();
  while (true) {
    const c = [
      extent[0] + Math.random() * (extent[2]-extent[0]),
      extent[1] + Math.random() * (extent[3]-extent[1])
    ]
    if (g.intersectsCoordinate(c)) return c;
  }
}

/** Center data on xy
 */
vectorLoader.setCenter = function(xy) {
  mapLoader.getView().setCenter(xy);
  checkReady();
};

/** Activate data
 */
vectorLoader.setActive = function(what) {
  for (let i in layers) {
    layers[i].setVisible(what.indexOf(i) >= 0);
  }
  checkReady();
};

// Show laoding info
function wait(e) {
  dialog.show({ 
    content: 'Chargement des données...',
    progress: e.nb,
    max: e.max
  })
}

/** Get a countryside place in the region
 * @param {number} region region index
 * @param {function} cback callback function that takes a coordinate
 */
vectorLoader.getCountryside = function(region, cback) {
  let c = getCoordinateInside(regions[region].getGeometry());
  vectorLoader.on('loading', wait)
  vectorLoader.setActive(['clc']);
  vectorLoader.setCenter(c)
  // On load end
  vectorLoader.once('ready', () => {
    // remove handler
    vectorLoader.un('loading', wait)
    // Look for country code (no urban area)
    let country = true;
    const extent = buffer(boundingExtent([c]),1000);
    vectorLoader.source.clc.forEachFeatureInExtent(extent, (f) => {
      if (f.get('code_18') < 200) {
        country = false;
      }
    });
    // Found a country side?
    if (!country) {
      console.log('not country side...')
      return vectorLoader.getCountryside(region, cback);
    } else {
      cback(c);
    }
  })
}

/** Get a road around the coord
 * @param {ol/Coordinate} c
 * @param {function} cback callback function that takes a road close to the initial position
 */
vectorLoader.getRoad = function(c, cback) {
  vectorLoader.on('loading', wait)
  vectorLoader.setActive(['route','clc'/*,'bati'*/]);
  vectorLoader.setCenter(c)
  // Zoom to start
  vectorLoader.once('ready', () =>{
    // remove handler
    vectorLoader.un('loading', wait)
    // Get closest road
    let importance = 6;
    const road = vectorLoader.source.route.getClosestFeatureToCoordinate(c, f => {
      // Search for 'route' & max importance
      return f.get('importance') > 5;
    });
    // Found any road?
    cback (road);
  })
}

/** Get a building around the coord
 * @param {function} getCoord
 * @param {function} cback callback function that takes a road close to the initial position
 */
vectorLoader.getBuilding = function(getCoord, cback) {
  const c = getCoord();
  vectorLoader.on('loading', wait)
  vectorLoader.setActive(['bati']);
  vectorLoader.setCenter(c);
  vectorLoader.once('ready', () => {
    // remove handler
    vectorLoader.un('loading', wait)
    // Get closest road
    const building = vectorLoader.source.bati.getClosestFeatureToCoordinate(c, f => {
      // Search for 'bati' & usage_1 = Résidentiel
      if (/r.sidentiel/i.test(f.get('usage_1'))) {
        return true;
      }
      return false;
    });
    // Found any building?
    if (building) {
      cback (building);
    } else {
      console.log('no building')
      vectorLoader.getBuilding(getCoord, cback);
    }
  })
}

export default vectorLoader
