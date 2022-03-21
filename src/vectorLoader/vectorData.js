import TileWFS from 'ol-ext/source/TileWFS'
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import mapLoader from './mapLoader';

// Source
function getSource(key, type, zoom) {
  return new TileWFS({
    url: 'https://wxs.ign.fr/'+key+'/geoportail/wfs',
    typeName: type,
    tileZoom: zoom,
    pagination: true
  });
}

const layers = {}
const sources = {}

// CLC
sources.clc = getSource('clc', 'LANDCOVER.CLC18_FR:clc18_fr', 13);
layers.clc = new VectorLayer({
  title: 'CLC',
  source: sources.clc,
  maxResolution: 10,  // prevent load on small zoom 
  visible: false,
})
mapLoader.addLayer(layers.clc);

// ROADS
sources.route = getSource('essentiels', 'BDTOPO_V3:troncon_de_route', 13);
layers.route = new VectorLayer({
  title: 'Routes',
  source: sources.route,
  maxResolution: 10,  // prevent load on small zoom 
  visible: false,
  style: new Style({
    stroke: new Stroke({ color: 'yellow', width: 2.5 })
  })
})
mapLoader.addLayer(layers.route);

// BUILDINGS
sources.bati = getSource('essentiels', 'BDTOPO_V3:batiment', 13);
layers.bati = new VectorLayer({
  title: 'Bati',
  source: sources.bati,
  maxResolution: 10,  // prevent load on small zoom 
  visible: false,
  style: new Style({
    stroke: new Stroke({ color: 'red', width: 2.5 })
  })
})
mapLoader.addLayer(layers.bati);

export { sources, layers }
