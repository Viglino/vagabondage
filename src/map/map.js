import Map from 'ol/Map'
import View from 'ol-ext/util/View'

import element from 'ol-ext/util/element'

import 'ol/src/ol.css'
import 'ol-ext/dist/ol-ext.css'
import './map.css'
import ScaleLine from 'ol-ext/control/CanvasScaleLine'
import Control from 'ol/control/Control'
import ol_ext_element from 'ol-ext/util/element'
import ol_control_Status from 'ol-ext/control/Status'

const map = new Map({
  target: element.create('DIV', {
    className: 'map',
    parent: document.body
  }),
  view: new View({
    zoom: 5,
    center: [166326, 5992663]
  })
})
map.getView().fit([-555496, 5020049, 1082619, 6665196]);

map.addControl(new ScaleLine);

const infoControl = new ol_control_Status({
  className: 'gameInfo start0'
})
map.addControl(infoControl);
infoControl.setVisible(true);

export { infoControl }
export default map
