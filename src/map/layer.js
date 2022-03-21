import map from './map'
import Geoportail from 'ol-ext/layer/Geoportail'

map.addLayer(new Geoportail({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS', preload: 14 }));

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