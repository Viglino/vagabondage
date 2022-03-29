import olObject from 'ol/Object'
import { buffer, boundingExtent } from 'ol/extent';
import dialog from '../map/dialog';

import mapLoader from './mapLoader';
import { sources, layers } from './vectorData';
import regions from './regions';
import Ajax from 'ol-ext/util/Ajax';
import { toLonLat } from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON'
import map from '../map/map';

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
    const road = vectorLoader.source.route.getClosestFeatureToCoordinate(c, f => {
      // Search for 'route' & importance 3 or 4
      return /route/i.test(f.get('nature')) && f.get('importance') < 5 && f.get('importance') > 2;
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

vectorLoader.loadGame = function(region, cback) {
  // Get a country side
  vectorLoader.getCountryside(region.value, c => {
    // Get the closest road
    vectorLoader.getRoad(c, road => {
      // Found any road?
      if (road) {
        c = road.getGeometry().getFirstCoordinate();
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
              building: buiding
            })
          } else {
            console.log('no building...')
            return loadGame(region);
          }
        });
      } else {
        console.log('no road...')
        return loadGame(region);
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
