import Map from 'ol/Map'
import View from 'ol/View'

import element from 'ol-ext/util/element'

import 'ol/src/ol.css'
import 'ol-ext/dist/ol-ext.css'
import './map.css'

const mapDiv = element.create('DIV', {
  className: 'map',
  parent: document.body
})

const map = new Map({
  target: mapDiv,
  view: new View({
    zoom: 5,
    center: [166326, 5992663]
  })
})

export default map
