import 'ol-ext/util/View'
import element from 'ol-ext/util/element';

import dialog from '../map/dialog';
import game from '../game'


import regions from '../vectorLoader/regions'

import intro from './intro.html'
import './intro.css'

// Show g intro
dialog.show({
  content: intro,
  className: 'intro',
  closeBox: false,
  buttons: ['Commencer le jeu']
})
const region = dialog.getContentElement().querySelector('SELECT');

// region.addEventListener('change', () => dialog.close());
// Add option
regions.forEach((f, i) => {
  element.create('OPTION', { text: f.get('nom'), value: i, parent: region });
});
region.value = Math.floor(Math.random() * regions.length);

// Start playing
dialog.once('hide', () => {
  game.load(region.value);
})

