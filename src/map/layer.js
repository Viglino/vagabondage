import map from './map'
import Geoportail from 'ol-ext/layer/Geoportail'
import VectorLayer from 'ol/layer/VectorImage';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';
import Icon from 'ol/style/Icon';
import FoldFilter from 'ol-ext/filter/Fold'
import ToggleControl from 'ol-ext/control/Toggle'
import FontSymbol from 'ol-ext/style/FontSymbol'

map.addLayer(new Geoportail({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS', preload: 14 }));
// map.addLayer(new Geoportail({ layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', preload: 14, visible: false }));

const style = new Style({
  image: new Circle({
    radius: 10,
    stroke: new Stroke({
      color: '#800',
      width: 3
    }),
    fill: new Fill({
      color: [0,0,0,0]
    })
  }),
  stroke: new Stroke({
    color: [0,0,255,.5],
    width: 5
  }),
  fill: new Fill({
    color: [255,0,0,.5]
  })
});

/** Style function
 */
function styleFn(f, res) {
  switch (f.get('style')) {
    case 'start': {
      return new Style({
        image: new Icon({
          src: './img/cross.png',
          opacity: .6,
          scale: .5 / res
        })
      })
    }
    case 'end': { 
      return [
        new Style({
          image: new Icon({
            src: './img/surround.png',
            opacity: .7,
            scale: 1 / res
          })
        }),
        new Style({
          image: new Icon({
            src: './img/rendez-vous.png',
            anchor: [.1,-.1],
            opacity: .7,
            scale: .9 / res
          })
        })
      ]
    }
    case 'poi': {
      return new Style({
        image: new FontSymbol({
          form: 'marker',
          radius: 10,
          offsetY: -5,
          fill: new Fill({ color: [0,0,255] }),
          stroke: new Stroke({ color: [255,255,255], width: 2 })
        }),
        zIndex: 1
      });
    }
    case 'car': {
      return new Style({
        image: new Icon({
          src: './img/car.png',
          opacity: .7,
          rotation: f.get('rot'),
          scale: 0.075 / res
        })
      })
    }
    case 'route': {
      return new Style({
        stroke: new Stroke({
          color: [255,0,255,.5],
          width: 5
        }),
        zIndex: 1
      })
    }
    default: return style;
  }
}

// Drawing layer
const vector = new VectorLayer({
  source: new VectorSource(),
  style: styleFn
});
map.addLayer(vector);

// Carte layer
const carte = new Geoportail({ 
  layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS', 
  key: 'om5z6xk76byacxz46km17jkx', 
  visible: false 
}, {
  minZoom: 15
});

// Fold map
const fold = new FoldFilter({ fill: true, padding: 20, opacity: .3 });
carte.addFilter(fold);
map.addLayer(carte);

function setFold() {
  const size = map.getSize();
  fold.set('fold', [Math.round(size[0]/180) || 1, Math.round(size[1]/250)] || 1)
}
window.addEventListener('resize', setFold);
setFold();

// Game layer
const layerCarte = new VectorLayer({
  source: new VectorSource(),
  visible: false,
  style: styleFn
});
map.addLayer(layerCarte);

// Toggle carte layers
map.addControl(new ToggleControl({
  className: 'carte',
  onToggle: (b) => {
    document.body.dataset.mode = b ? 'carte' : 'photo';
    layerCarte.setVisible(b);
    carte.setVisible(b);
    if (b && map.getView().getZoom() > 14.5) {
      map.getView().setZoom(14.5);
    }
  }
}))

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

export { layerCarte }
export default vector
