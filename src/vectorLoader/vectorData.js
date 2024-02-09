import TileWFS from 'ol-ext/source/TileWFS'
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import mapLoader from './mapLoader';

// Source
function _getSource(key, type, zoom) {
  return new TileWFS({
    // url: 'https://wxs.ign.fr/'+key+'/geoportail/wfs',
    url: 'https://data.geopf.fr/wfs/ows',
    typeName: type,
    tileZoom: zoom,
    pagination: true
  });
}

const layers = {}
const sources = {}

// CLC
sources.clc = _getSource('clc', 'LANDCOVER.CLC18_FR:clc18_fr', 13);
layers.clc = new VectorLayer({
  title: 'CLC',
  source: sources.clc,
  maxResolution: 10,  // prevent load on small zoom 
  visible: false,
})
mapLoader.addLayer(layers.clc);

// ROADS
sources.route = _getSource('essentiels', 'BDTOPO_V3:troncon_de_route', 13);
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
sources.bati = _getSource('essentiels', 'BDTOPO_V3:batiment', 13);
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

// ZAI
sources.zai = _getSource('topographie', 'BDTOPO_V3:zone_d_activite_ou_d_interet', 13);
layers.zai = new VectorLayer({
  title: 'ZAI',
  source: sources.zai,
  maxResolution: 10,  // prevent load on small zoom 
  visible: false,
})
mapLoader.addLayer(layers.zai);

export { sources, layers }
