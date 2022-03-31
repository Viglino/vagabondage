import olObject from 'ol/Object'
import { buffer, boundingExtent } from 'ol/extent';
import dialog from '../map/dialog';

import mapLoader from './mapLoader';
import { sources, layers } from './vectorData';
import Ajax from 'ol-ext/util/Ajax';
import { computeDestinationPoint } from 'ol-ext/geom/sphere'
import { fromLonLat, toLonLat } from 'ol/proj';
import { getCenter } from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON'

import map from '../map/map';
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

/** Is ready (or loadend)  */
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
 * @param {Array<string>} what list of layer id
 * @param {ol/Coordinate} [center]
 */
vectorLoader.setActive = function(what, center) {
  // Hide layers
  for (let i in layers) {
    layers[i].setVisible(false);
  }
  // set center
  if (center) vectorLoader.setCenter(center);
  // how layer
  what.forEach(l => layers[l].setVisible(true));
  // ready?
  checkReady();
};

// Show laoding info
function wait(e) {
  dialog.show({ 
    content: 'Chargement des données...',
    progress: e.nb,
    max: e.max,
    closeBox: false
  })
}

/** Get a countryside place in the region
 * @param {number} region region index
 * @param {function} cback callback function that takes a coordinate
 */
vectorLoader.getCountryside = function(region, cback) {
  let c = getCoordinateInside(regions[region].getGeometry());
  vectorLoader.on('loading', wait)
  vectorLoader.setActive(['clc'], c);
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
  vectorLoader.setActive(['route','clc'/*,'bati'*/], c);
  // Zoom to start
  vectorLoader.once('ready', () =>{
    // remove handler
    vectorLoader.un('loading', wait)
    // Get closest road
    const road = vectorLoader.source.route.getClosestFeatureToCoordinate(c, f => {
      // Search for 'route' & importance 3 or 4
      return /route/i.test(f.get('nature')) && f.get('importance') < 5 && f.get('importance') > 2;
    });
    // Found any road?
    cback (road);
  })
}

/** Get a building around a coord
 * @param {function} getCoord a function that returns a coordinate to look near 
 * @param {function} cback callback function that takes a road close to the initial position
 */
vectorLoader.getBuilding = function(getCoord, cback) {
  const c = getCoord();
  vectorLoader.on('loading', wait)
  vectorLoader.setActive(['bati'], c);
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
      // Look for another direction
      console.log('no building')
      vectorLoader.getBuilding(getCoord, cback);
    }
  })
}

/** Load game info inisde a region
 * 
 */
vectorLoader.loadGame = function(region, cback) {
  // Get a country side
  vectorLoader.getCountryside(region, c => {
    // Get the closest road
    vectorLoader.getRoad(c, road => {
      // Found any road?
      if (road) {
        c = road.getGeometry().getCoordinates()[1];
        const land = vectorLoader.source.clc.getClosestFeatureToCoordinate(c);
        vectorLoader.getBuilding(() => {
          return fromLonLat(computeDestinationPoint(toLonLat(c), 10000 + 5000*Math.random(), Math.random()*2*Math.PI));
        }, building => {
          if (building) {
            return cback({
              start: c,
              end: getCenter(building.getGeometry().getExtent()),
              land: land,
              road: road,
              building: building
            })
          } else {
            console.log('no building...')
            return vectorLoader.loadGame(region, cback);
          }
        });
      } else {
        console.log('no road...')
        return vectorLoader.loadGame(region, cback);
      }
    })
  })
}

/** Load routing
 * @param {ol/Coordinate} start
 * @param {ol/Coordinate} end
 * @param {function} cback a callback that take the routing response
 */
vectorLoader.getRouting = function(start, end, cback) {
  start = toLonLat(start);
  end = toLonLat(end);
  Ajax.get({
    url: 'https://wxs.ign.fr/calcul/geoportail/itineraire/rest/1.0.0/route?'
      + 'resource=bdtopo-osrm'
      + '&profile=pedestrian'
      + '&optimization=shortest'
      + '&start='+start[0]+','+start[1]
      + '&end='+end[0]+','+end[1]
      + '&geometryFormat=geojson',
    success: (resp) => {
      const parser = new GeoJSON;
      const f = {
        type: 'Feature',
        properties: {
          type: 'result'
        },
        geometry: resp.geometry
      }
      resp.feature = parser.readFeature(f, { featureProjection: map.getView().getProjection() });
      cback(resp);
    },
    error: console.log
  })
}

export default vectorLoader
