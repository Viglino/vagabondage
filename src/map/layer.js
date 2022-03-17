import map from './map'
import Geoportail from 'ol-ext/layer/Geoportail'

map.addLayer(new Geoportail({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS' }))