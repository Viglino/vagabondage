import Map from 'ol/Map'
import View from 'ol-ext/util/View'

import element from 'ol-ext/util/element'
import Notification from 'ol-ext/control/Notification'

import 'ol/src/ol.css'
import 'ol-ext/dist/ol-ext.css'
import './map.css'
import ScaleLine from 'ol-ext/control/CanvasScaleLine'
import ol_control_Status from 'ol-ext/control/Status'

const map = new Map({
  target: element.create('DIV', {
    className: 'map',
    parent: document.body
  }),
  view: new View({
    zoom: 5,
    minZoom: 11,
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

const notification = new Notification();
map.addControl(notification)

export { infoControl }
export { notification }
export default map
