import ol_ext_element from 'ol-ext/util/element';
import Map from 'ol/Map'
import View from 'ol/View'

import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile'
import MVT from 'ol/format/MVT'
import Style, { createDefaultStyle } from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Shape from 'ol/style/RegularShape'

import map from '../map/map'

/** Ghost map to preload layers on extent */
const mapLoader = new Map({
  target: ol_ext_element.create('DIV', { 
    className: 'ghostMap vtile', 
    style: {
      width: '1204px',
      height: '1024px'
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

const style = {
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
      fill: new Fill({ color: '#ccc' })
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
const vtLayer = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    // maxZoom: 15,
    format: new MVT,
    url: 'https://wxs.ign.fr/essentiels/geoportail/tms/1.0.0/PLAN.IGN/{z}/{x}/{y}.pbf',
  }),
  style: (f) => {
    if (/toponyme/.test(f.get('layer'))) return [];
    return style[f.get('layer')] || createDefaultStyle(f);
  }
});

mapLoader.on('click', e => {
  const features = mapLoader.getFeaturesAtPixel(e.pixel);
  features.forEach(f => {
    console.table (f.getProperties());
  })
})
map.on('moveend', () => {
  mapLoader.getView().setCenter(map.getView().getCenter());
})

window.loader = mapLoader

mapLoader.addLayer(vtLayer)