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
const region = dialog.getContentElement().querySelector('.region');
const length = dialog.getContentElement().querySelector('.length');
const month = dialog.getContentElement().querySelector('.month');

// region.addEventListener('change', () => dialog.close());
// Add option
regions.forEach((f, i) => {
  element.create('OPTION', { text: f.get('nom'), value: i, parent: region });
});
region.value = Math.floor(Math.random() * regions.length);

const deft = Math.floor(Math.random()*6) + 4;
for (let m=1; m<=12; m++) {
  const o = element.create('OPTION', {
    value: m,
    html: new Date(Date.UTC(2012, m-1)).toLocaleString(undefined, { month: 'long' }),
    parent: month
  });
  if (m===deft) o.setAttribute('selected', 'selected');
  // spring - summer
  if (m < 4 || m > 9) {
    o.setAttribute('disabled', 'disabled');
  }
}

// Start playing
dialog.once('hide', () => {
  game.load(region.value, parseInt(length.value), month.value);
})

