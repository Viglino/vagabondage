import Map from 'ol/Map'
import View from 'ol/View'

import element from 'ol-ext/util/element'

import 'ol/src/ol.css'
import 'ol-ext/dist/ol-ext.css'
import './map.css'
import ScaleLine from 'ol-ext/control/CanvasScaleLine'

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

map.addControl(new ScaleLine)

export default map
