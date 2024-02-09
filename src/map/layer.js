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
import RegularShape from 'ol/style/RegularShape';
import TextStyle from 'ol/style/Text';
import pages from '../page/pages'
import helpInfo from '../game/helpInfo';

map.addLayer(new Geoportail({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS', preload: 5 }));
// map.addLayer(new Geoportail({ layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2', preload: 5, visible: false }));

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
    case 'finish': {
      return new Style({
        image: new FontSymbol({
          form: 'bookmark',
          radius: 8,
          fill: new Fill({ color: [0,128,0] }),
          stroke: new Stroke({ color: [255,255,255], width: 2 })
        }),
        zIndex: 1
      });
    }
    case 'altercation': {
      return new Style({
        image: new RegularShape({
          radius: 10,
          radius2: 5,
          points: 7,
          fill: new Fill({ color: [80,0,0] }),
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
    case 'routeMap': {
      return new Style({
        stroke: new Stroke({
          color: [0,0,128,.5],
          width: 10
        }),
        zIndex: 1
      })
    }
    case 'travel': {
      return new Style({
        stroke: new Stroke({
          color: [255,0,0,.5],
          width: 100 / res,
          lineCap: 'square'
        })
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

// Debug layer
const debug = new VectorLayer({
  source: new VectorSource(),
  style: new Style({
    stroke: new Stroke({
      color: [255,0,0,.5],
      width: 2
    })
  })
});
map.addLayer(debug);

Geoportail.register("GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR", {"layer":"GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR","key":"ign_scan_ws","theme":"cartes","desc":"La carte topographique représente avec précision le relief, symbolisé par des courbes de niveaux, ainsi que les détails du terrain : routes, sentiers, constructions, bois, arbre isolé, rivière, source... </br>En France, la carte topographique de base est réalisée par l'IGN. Le SCAN 25 Touristique comprend les pictogrammes du thème tourisme de la carte de base.","server":"https://data.geopf.fr/private/wmts","bbox":[-178.206,-46.5029,77.6492,51.1751],"format":"image/jpeg","minZoom":6,"maxZoom":16,"originators":{"Geoservices":{"attribution":"Géoservices","href":"https://geoservices.ign.fr/"}},"queryable":false,"style":"normal","tilematrix":"PM","title":"Carte topographique (IGN Scan25)","legend":["https://data.geopf.fr/annexes/ressources/legendes/LEGEND.jpg"]});
// Carte layer
const carte = new Geoportail({ 
  layer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR',
  preload: 5, 
  key: 'ign_scan_ws', 
  visible: false 
}, {
  // minZoom: 15
});

// Fold map
const fold = new FoldFilter({ fill: true, padding: 20, opacity: .3 });
carte.addFilter(fold);
map.addLayer(carte);


// Game layer
const layerCarte = new VectorLayer({
  source: new VectorSource(),
  visible: false,
  style: styleFn
});
const fold2 = new FoldFilter({ fill: false, padding: 20, opacity: 0 });
layerCarte.addFilter(fold2);
map.addLayer(layerCarte);

function setFold() {
  const size = map.getSize();
  fold.set('fold', [Math.round(size[0]/180) || 1, Math.round(size[1]/250)] || 1)
  fold2.set('fold', [Math.round(size[0]/180) || 1, Math.round(size[1]/250)] || 1)
}
window.addEventListener('resize', setFold);
setFold();

// Toggle carte layers
map.addControl(new ToggleControl({
  className: 'carte',
  title: 'La carte !',
  onToggle: (b) => {
    document.body.dataset.mode = b ? 'carte' : 'photo';
    layerCarte.setVisible(b);
    carte.setVisible(b);
    helpInfo.hide('carte');
    if (b && map.getView().getZoom() > 15) {
      map.getView().setZoom(15);
    }
    if (b && !localStorage.getItem('vagabondage@help-legend')) {
      pages.showHelpLegend();
      localStorage.setItem('vagabondage@help-legend', 1)
    }
  }
}))


// Help layer
const helpSymbol = {
  'default': new Style({
    image: new RegularShape({
      radius: 10,
      radius2: 5,
      points: 5,
      fill: new Fill({ color: [255,128,0] }),
      stroke: new Stroke({ color: [255,255,255], width: 2 })
    })
  }),
  'info': new Style({
    image: new Icon({
      src: './actions/undef.svg',
      opacity: 1,
      scale: .02
    })
  }),
  'food': new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color: [80,0,0] }),
      stroke: new Stroke({ color: [255,255,255], width: 2 })
    })
  }),
  'water': new Style({
    image: new Circle({
      radius: 6,
      fill: new Fill({ color: [0,128,255] }),
      stroke: new Stroke({ color: [255,255,255], width: 2 })
    })
  })
}

const layerHelp = new VectorLayer({
  source: new VectorSource(),
  visible: true,
  opacity: .7,
  declutter: true,
  style: f => helpSymbol[f.get('type')] || helpSymbol['default']
});
map.addLayer(layerHelp)


export { style }
export { layerCarte, layerHelp, debug }
export default vector
