import ol_ext_element from 'ol-ext/util/element';
import Map from 'ol/Map'
import View from 'ol/View'
import { buffer, boundingExtent } from 'ol/extent';

import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile'
import MVT from 'ol/format/MVT'
import Style, { createDefaultStyle } from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Shape from 'ol/style/RegularShape'

import map from '../map/map'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { ol_geom_createFromType } from 'ol-ext/geom/GeomUtils'

/** Ghost map to preload layers on extent */
const size = '1024px';
//const size = '2048px':
const mapLoader = new Map({
  target: ol_ext_element.create('DIV', { 
    className: 'ghostMap vtile', 
    style: {
      width: size,
      height: size
    },
    parent: document.body 
  }),
  view: new View({
    zoom: 16,
    minZoom: 16,
    maxZoom: 17,
    center: [263561.5, 5842622.5]
  }),
  // interactions: [],
  controls: [],
});


// Handle map loading
mapLoader.on('loadstart', () => {
  mapLoader.set('loading', true);
});
mapLoader.on('loadend', () => {
  mapLoader.set('loading', false);
});

const style = {
  // BDTOPO
  adresse: [],
  arrondissement: [],
  bassin_versant_topographique: [],
  "collectivite_territoriale": [],
  "commune": [],
  "departement": [],
  "Communauté d'agglomération": [],
  "region": [],
  "epci": [],
  "toponymie_lieux_nommes": [],
  "haie": [],
  "voie_nommee": [],
  zone_de_vegetation: new Style({
    fill: new Fill({ color: [0,80,0,.5] })
  }),
  "surface_hydrographique": new Style({
    fill: new Fill({ color: [100,150,255,1] })
  }), 
  "troncon_hydrographique": new Style({
    stroke: new Stroke({ color: [100,150,255,1], width: 2 })
  }), 
  "troncon_de_route": new Style({
    stroke: new Stroke({ color: [255,128,1], width: 2 })
  }), 
  batiment: new Style({
    fill: new Fill({ color: [128,80,80,1] })
  }),
  zone_d_habitation: new Style({
    fill: new Fill({ color: [128,0,0,.1] })
  }),

  "zone_d_activite_ou_d_interet": new Style({
    fill: new Fill({ color: [255,0,255,.3] })
  }),

  // CARTE
  fond_opaque: [],
  oro_courbe: [],
  oro_ponc: [],
  limite_lin: [],
  ferre: new Style({
    stroke: new Stroke({ color: [0,0,0], width: 2 })
  }), 
  oro_lin: new Style({
    stroke: new Stroke({ color: [177,135,79,.6], width: 2 })
  }), 
  routier_ponc: new Style({
    image: new Circle({
      radius: 3,
      fill: new Fill({ color: [100,0,2505,1] })
    })
  }), 
  routier_route: new Style({
    stroke: new Stroke({ color: [255,128,1], width: 2 })
  }), 
  routier_chemin: new Style({
    stroke: new Stroke({ color: [255,255,1], width: 2 })
  }), 
  routier_surf: new Style({
    fill: new Fill({ color: [0,0,0,.5] })
  }),
  hydro_ponc: new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({ color: [100,150,255,1] })
    })
  }), 
  hydro_surf: new Style({
    fill: new Fill({ color: [100,150,255,1] })
  }), 
  hydro_reseau: new Style({
    stroke: new Stroke({ color: [100,150,255,1], width: 2 })
  }), 
  bati_lin: new Style({
    stroke: new Stroke({ color: '#ccc', width: 2 })
  }), 
  bati_ponc: new Style({
    image: new Shape({
      points: 4,
      rotation: Math.PI/4,
      radius: 5,
      fill: new Fill({ color: '#333' })
    })
  }),
  bati_surf: new Style({
    fill: new Fill({ color: [128,80,80,1] })
  }),
  bati_zai: new Style({
    fill: new Fill({ color: [0,80,80,.3] })
  }),
  bati_zone_surf: new Style({
    fill: new Fill({ color: [80,0,0,.3] })
  }),
  ocs_vegetation_surf: new Style({
    fill: new Fill({ color: [0,80,0,.5] })
  })
}

// Vector tile layer
const vtLayer = new VectorTileLayer({
  // declutter: true,
  source: new VectorTileSource({
    // maxZoom: 15,
    format: new MVT,
    url: 'https://wxs.ign.fr/latuile/geoportail/tms/1.0.0/BDTOPO/{z}/{x}/{y}.pbf',
    // url: 'https://wxs.ign.fr/essentiels/geoportail/tms/1.0.0/PLAN.IGN/{z}/{x}/{y}.pbf',
  }),
  style: (f) => {
    if (/^toponyme(.*)lin$/.test(f.get('layer'))) return [];
    return style[f.get('layer')] || createDefaultStyle(f);
  }
});

// Center on map
map.on('moveend', () => {
  mapLoader.getView().setCenter(map.getView().getCenter());
})

mapLoader.addLayer(vtLayer);

/** DEBUG: show object on click */
const select = new VectorLayer({ 
  source: new VectorSource(),
  style: new Style({
    stroke: new Stroke({ color: [255,0,0], width: 3 })
  })
});
mapLoader.addLayer(select);
// DEBUG
mapLoader.on('click', e => {
  select.getSource().clear();
  const features = mapLoader.getFeaturesAtPixel(e.pixel);
  const prop = [];
  features.forEach(f => prop.push(f.getProperties()))
  const info = {};
  prop.forEach((p,i) => {
    info[i+'-'+p.layer] = {
      nature: p.nature || p.type_de_route || p.importance || '',
      nom: p.toponyme || p.graphie_du_toponyme || p.cpx_numero || p.numero || p.usage_1 || p.origine || ''
    }
  })
  console.clear();
  console.table(info);
  console.log(prop);
  const feature = features[0];
  if (feature) {
    select.getSource().addFeature(vtFeature(feature));
  }
})

/** Get vtile object as Feature
 * @param {Object} feature
 * @returns {ol/Feature}
 */
function vtFeature(feature) {
  if (feature && !(feature instanceof Feature)) {
    var coords = [];
    var c = feature.getFlatCoordinates();
    for (var i=0; i<c.length; i+=2) {
      coords.push ([c[i],c[i+1]]);
    }
    // console.log(feature.getType())
    switch (feature.getType()) {
      case 'Point': {
        coords = coords.pop();
        break;
      }
      case 'LineString' : {
        coords = coords;
        break;
      }
      case 'MultiLineString' : 
      case 'Polygon' : {
        coords = [coords];
        break;
      }
    }
    var geom = ol_geom_createFromType(feature.getType(), coords);
    var f2 = new Feature(geom);
    f2.setProperties(feature.getProperties());
    return f2;
  }
  return feature;
}

/** Get features as ol/Features
 * @param {Array<Object>} features
 * @returns {Arrat<ol/Feature>}
 */
function vtFeatures(features) {
  const result = []
  features.forEach(f => {
    result.push(vtFeature(f));
  })
  return result
}

/* Vector loader */
function getFeaturesAtPixel(pixel, options, cback) {
  const features = mapLoader.getFeaturesAtPixel(pixel, { hitTolerance: options.tolerance || 100 });
  if (options.filter) {
    const resp = [];
    features.forEach(f => {
      if (options.filter && f.get('layer') === options.filter) resp.push(f);
    })
    cback(resp);
  } else {
    cback(features);
  }
}

/* GetFeature at pixel (on render complete) */
function getFeaturesAt(coord, options, cback) {
  mapLoader.getView().setCenter(coord);
  setTimeout(() => {
    const pixel = mapLoader.getPixelFromCoordinate(coord);
    mapLoader.once('rendercomplete', () => {
      getFeaturesAtPixel(pixel, options, cback);
    })
    mapLoader.render();
  })
}

function getFeaturesInExtent(coord, options, cback) {
  mapLoader.getView().setCenter(coord);
  setTimeout(() => {
    mapLoader.once('rendercomplete', () => {
      const extent = buffer(boundingExtent([coord]), (options.tolerance || 100) * mapLoader.getView().getResolution());
      const features = vtLayer.getSource().getFeaturesInExtent(extent);
      if (options.filter) {
        const resp = [];
        features.forEach(f => {
          if (options.filter && f.get('layer') === options.filter) resp.push(f);
        })
        cback(resp);
      } else {
        cback(features);
      }
    });
    mapLoader.render();
  });
}

const vtLoader = {
  map: mapLoader,
  layer: vtLayer,
  getFeaturesAt: getFeaturesAt,
  getFeaturesInExtent: getFeaturesInExtent,
  vtFeature: vtFeature,
  vtFeatures: vtFeatures
}

/* DEBUG */
window.vtLoader = vtLoader;
/**/

export { vtLoader }
export default mapLoader
