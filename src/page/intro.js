import dialog from '../map/dialog';
import map from '../map/map'
import 'ol-ext/util/View'

import intro from './intro.html'
import './intro.css'

dialog.show({
  content: intro,
  className: 'intro',
  buttons: ['Commencer le jeu']
})

dialog.once('hide', () => {
  console.log('start Game!')
  map.getView().flyTo({
    type: 'moveTo',
    zoom: 16,
    zoomAt: map.getView().getZoom()+.1
  })
})
