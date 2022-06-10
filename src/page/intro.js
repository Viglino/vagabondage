import element from 'ol-ext/util/element';
import { render } from 'github-buttons'
import dialog from '../map/dialog';
import game from '../game/game'


import regions from '../vectorLoader/regions'

import intro from './intro.html'
import './intro.css'

// Show intro dialog
dialog.show({
  content: intro,
  className: 'intro',
  closeBox: false,
  buttons: ['Commencer le jeu']
})
const region = dialog.getContentElement().querySelector('.region');
const length = dialog.getContentElement().querySelector('.length');
const month = dialog.getContentElement().querySelector('.month');
/*
var my_awesome_script = document.createElement('script');
my_awesome_script.setAttribute('src','https://buttons.github.io/buttons.js');
document.body.appendChild(my_awesome_script);
*/
dialog.getContentElement().querySelectorAll('.github-button').forEach(b => {
  render(b, function (el) {
    b.parentNode.replaceChild(el, b)
  })
})

const helpBt = dialog.element.querySelector('.helpBt input')
helpBt.checked = !localStorage.getItem('vagabond@help-main');
helpBt.addEventListener('change', () => {
  if (helpBt.checked) {
    localStorage.removeItem('vagabond@help-main');
  } else {
    localStorage.setItem('vagabond@help-main', 1);
  }
})

// Add regions option
regions.forEach((f, i) => {
  element.create('OPTION', { text: f.get('nom'), value: i, parent: region });
});
region.value = Math.floor(Math.random() * regions.length);

// Road length
length.addEventListener('change', () => {
  const opt = length.options[length.selectedIndex];
  length.nextElementSibling.innerText = opt.dataset.txt;
  length.nextElementSibling.dataset.diff = opt.dataset.txt;
});

// Add season month
const deft = Math.floor(Math.random()*6) + 4;
for (let m=1; m<=12; m++) {
  const o = element.create('OPTION', {
    value: m,
    html: new Date(Date.UTC(2012, m-1)).toLocaleString(undefined, { month: 'long' }),
    parent: month
  });
  if (m===deft) o.setAttribute('selected', 'selected');
  // Only spring - summer (no meteo)
  if (m < 4 || m > 9) {
    o.setAttribute('disabled', 'disabled');
  }
}

// Start playing
dialog.once('hide', () => {
  game.load(region.value, parseInt(length.value), month.value);
})

