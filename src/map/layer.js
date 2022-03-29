import map from './map'
import Geoportail from 'ol-ext/layer/Geoportail'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';

map.addLayer(new Geoportail({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS', preload: 14 }));
//map.addLayer(new Geoportail({ layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', preload: 14 }));

/* NASA black marble ?
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'

const nightLayer = new TileLayer({
  source: new XYZ ({
    url: 'https://wms.openstreetmap.fr/tms/1.0.0/nasa_black_marble/{z}/{x}/{y}',
    maxZoom: 10
  }),
  opacity: .3
})
map.addLayer(nightLayer);
//  https://wms.openstreetmap.fr/tms/1.0.0/nasa_black_marble/5/15/9
window.nightLayer = nightLayer
*/

// Drawing layer
const vector = new VectorLayer({
  source: new VectorSource()  ,
  style: new Style({
    image: new Circle({
      radius: 10,
      stroke: new Stroke({
        color: '#800',
        width: 3
      })
    }),
    stroke: new Stroke({
      color: [255,0,0,.5],
      width: 1.5
    }),
    fill: new Fill({
      color: [255,0,0,.5]
    })
  })
});
map.addLayer(vector);

/*
import DayNight from 'ol-ext/source/DayNight'
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
var nightDay = new DayNight({ });
map.addLayer(new VectorLayer({
  className: 'night',
  source: nightDay,
  style: new Style({
    fill: new Fill({
      color: [0,0,50,.8]
    })
  })
}));
window.nightDay = nightDay
*/

export default vector
