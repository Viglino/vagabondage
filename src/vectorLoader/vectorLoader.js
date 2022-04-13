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

/** Class to load data in a tile WFS format
 */
class VectorLoader extends olObject {
  constructor() {
    super();
    this.map = mapLoader;
    this.source = sources;
    this.layer = layers;
    // Ajax load for routing
    this.ajax = new Ajax();
    this.ajax.on('success', e => {
      const resp = e.response;
      const parser = new GeoJSON;
      const f = {
        type: 'Feature',
        properties: {
          type: 'result'
        },
        geometry: resp.geometry
      }
      resp.feature = parser.readFeature(f, { featureProjection: map.getView().getProjection() });
      this.cback(resp);
    })
    this.ajax.on('error', console.log);
    // Handle load
    this.toload = 0;
    let maxload = 0;
    Object.keys(sources).forEach(k => {
      sources[k].on('tileloadstart', () => {
        this.toload++;
        maxload++;
        this.dispatchEvent({ type: 'loading', nb: maxload - this.toload, max: maxload });
      });
    })
    Object.keys(sources).forEach(k => {
      sources[k].on(['tileloadend', 'tileloaderror'], () => {
        this.toload--;
        this.dispatchEvent({ type: 'loading', nb: maxload - this.toload, max: maxload });
        if (this.toload===0) {
          setTimeout(() => this.dispatchEvent('ready'));
          maxload = 0;
        }
      })
    })
  }
}


/** Dispatch a ready event. Check if the loader is ready or wait for loadend.
 * @fires ready
 */
VectorLoader.prototype.checkReady = function() {
  setTimeout(() => {
    if (this.toload === 0) {
      this.dispatchEvent('ready');
    }
  })
}


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
VectorLoader.prototype.setCenter = function(xy) {
  this.map.getView().setCenter(xy);
  this.checkReady();
};

/** Activate data
 * @param {Array<string>} what list of layer id
 * @param {ol/Coordinate} [center]
 */
VectorLoader.prototype.setActive = function(what, center) {
  // Hide layers
  for (let i in layers) {
    layers[i].setVisible(false);
  }
  // set center
  if (center) this.setCenter(center);
  // how layer
  what.forEach(l => layers[l].setVisible(true));
  // ready?
  this.checkReady();
};

// Show laoding info
function wait(e) {
  /*
  dialog.show({ 
    content: 'Chargement des données...',
    progress: e.nb,
    max: e.max,
    closeBox: false
  })
  */
 dialog.setProgress(e.nb, e.max, dialog._progressMessage.innerHTML);
}

/** Get a countryside place in the region
 * @param {number} region region index
 * @param {function} cback callback function that takes a coordinate
 */
VectorLoader.prototype.getCountryside = function(region, cback) {
  dialog.show({ 
    content: 'Chargement des données...',
    closeBox: false
  })
  dialog.setProgress(0,1,'<i class="fg-layer-alt-o"></i> loading countryside...')

  let c = getCoordinateInside(regions[region].getGeometry());
  this.on('loading', wait)
  this.setActive(['clc'], c);
  // On load end
  this.once('ready', () => {
    // remove handler
    this.un('loading', wait)
    // Look for country code (no urban area)
    let country = true;
    const extent = buffer(boundingExtent([c]),1000);
    this.source.clc.forEachFeatureInExtent(extent, (f) => {
      if (f.get('code_18') < 200) {
        country = false;
      }
    });
    // Found a countryside?
    if (!country) {
      console.log('not countryside...')
      this.getCountryside(region, cback);
    } else {
      cback(c);
    }
  })
}

/** Get a road around the coord
 * @param {ol/Coordinate} c
 * @param {function} cback callback function that takes a road close to the initial position
 */
VectorLoader.prototype.getRoad = function(c, cback) {
  dialog.setProgress(0,1,'<i class="fg-layer-alt-o"></i> loading road...')

  this.on('loading', wait)
  this.setActive(['route','clc'/*,'bati'*/], c);
  // Zoom to start
  this.once('ready', () =>{
    // remove handler
    this.un('loading', wait)
    // Get closest road
    const road = this.source.route.getClosestFeatureToCoordinate(c, f => {
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
VectorLoader.prototype.getBuilding = function(getCoord, cback) {
  dialog.setProgress(0,1,'<i class="fg-layer-stack-o"></i> loading building...')

  const c = getCoord();
  this.on('loading', wait)
  this.setActive(['bati'], c);
  this.once('ready', () => {
    // remove handler
    this.un('loading', wait)
    // Get closest road
    const building = this.source.bati.getClosestFeatureToCoordinate(c, f => {
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
      this.getBuilding(getCoord, cback);
    }
  })
}

/** Load game info inisde a region
 * 
 */
VectorLoader.prototype.loadGame = function(region, length, cback) {
  // Get a countryside
  this.getCountryside(region, c => {
    // Get the closest road
    this.getRoad(c, road => {
      // Found any road?
      if (road) {
        c = road.getGeometry().getCoordinates()[1];
        const land = this.source.clc.getClosestFeatureToCoordinate(c);
        this.getBuilding(() => {
          return fromLonLat(computeDestinationPoint(toLonLat(c), length*1000 + 5000*Math.random(), Math.random()*2*Math.PI));
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
            return this.loadGame(region, cback);
          }
        });
      } else {
        console.log('no road...')
        return this.loadGame(region, cback);
      }
    })
  })
}


/** Load routing
 * @param {ol/Coordinate} start
 * @param {ol/Coordinate} end
 * @param {function} cback a callback that take the routing response
 */
VectorLoader.prototype.getRouting = function(start, end, cback) {
  this.cback = cback;
  start = toLonLat(start);
  end = toLonLat(end);
  this.ajax.send('https://wxs.ign.fr/calcul/geoportail/itineraire/rest/1.0.0/route?'
    + 'resource=bdtopo-osrm'
    + '&profile=pedestrian'
    + '&optimization=shortest'
    + '&start='+start[0]+','+start[1]
    + '&end='+end[0]+','+end[1]
    + '&geometryFormat=geojson'
  );
}

const vectorLoader = new VectorLoader();

export default vectorLoader
