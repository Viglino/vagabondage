import ol_ext_element from 'ol-ext/util/element';
import Map from 'ol/Map'
import View from 'ol/View'
import Geoportail from 'ol-ext/layer/Geoportail'

/** Ghost map to preload layers on extent */
const mapLoader = new Map({
  target: ol_ext_element.create('DIV', { 
    className: 'ghostMap', 
    style: {
      width: '255px',
      height: '255px'
    },
    parent: document.body 
  }),
  view: new View({
    zoom: 14,
    minZoom: 14,
    maxZoom: 17,
    center: [263561.5, 5842622.5]
  }),
  interactions: [],
  controls: [],
});

mapLoader.addLayer(new Geoportail({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS', opacity: 1 }));

/* DEBUG: Show info on hover */
import Hover from 'ol-ext/interaction/Hover'
import Tooltip from 'ol-ext/overlay/Tooltip'
import geoportailStyle from 'ol-ext/style/geoportailStyle'

const clcInfo = geoportailStyle.clcColors;
const tooltip = new Tooltip();
mapLoader.addOverlay(tooltip);

const hover = new Hover;
mapLoader.addInteraction(hover);
hover.on('enter', e => {
  const f = e.feature;
  const info = clcInfo[f.get('code_18')];
  tooltip.setInfo(info ? info.title : (f.get('usage_1') ? 'bati: '+f.get('nature') : f.get('nature')))
  //console.log(e.feature.getProperties())
})
/**/

export default mapLoader
