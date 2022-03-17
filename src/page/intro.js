import dialog from '../map/dialog';

import intro from './intro.html'
import './intro.css'

dialog.show({
  content: intro,
  className: 'intro',
  buttons: ['Commencer le jeu']
})
  