import ol_ext_element from 'ol-ext/util/element';
import Map from 'ol/Map'
import View from 'ol/View'
import Geoportail from 'ol-ext/layer/Geoportail'

/** Ghost map to preload layers on extent */
const vectorloader = new Map({
  target: ol_ext_element.create('DIV', { 
    className: 'ghostMap', 
    style: {
      width: '512px',
      height: '512px'
    },
    parent: document.body 
  }),
  view: new View({
    zoom: 15,
    minZoom: 15,
    maxZoom: 17,
    center: [263561.5, 5842622.5]
  }),
  interactions: [],
  controls: [],
});

vectorloader.addLayer(new Geoportail({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS' }));

export default vectorloader
