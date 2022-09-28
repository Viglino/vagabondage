import element from 'ol-ext/util/element';
import { render } from 'github-buttons'
import dialog from '../map/dialog';
import game from '../game/game'


import regions from '../vectorLoader/regions'

import intro from './intro.html'
import './intro.css'
import help from './help';
import helpInfo from '../game/helpInfo';

// Show intro dialog
dialog.show({
  content: intro,
  className: 'intro',
  closeBox: false,
  buttons: ['Commencer le jeu']
})
const region = dialog.getContentElement().querySelector('.region');
const level = dialog.getContentElement().querySelector('.level');
const length = dialog.getContentElement().querySelector('.length');
const month = dialog.getContentElement().querySelector('.month');

// Render buttons
dialog.getContentElement().querySelectorAll('.github-button').forEach(b => {
  render(b, function (el) {
    b.parentNode.replaceChild(el, b)
  })
})

const helpBt = dialog.element.querySelector('.helpBt input')
helpBt.checked = !help.isDone();
helpBt.addEventListener('change', () => {
  if (helpBt.checked) {
    help.reset();
    helpInfo.reset();
  } else {
    help.done();
  }
})

// Add regions option
regions.forEach((f, i) => {
  element.create('OPTION', { text: f.get('nom'), value: i, parent: region });
});
region.value = Math.floor(Math.random() * regions.length);

// Road length / difficulty
length.addEventListener('change', () => {
  const opt = length.options[length.selectedIndex];
  length.nextElementSibling.innerText = opt.dataset.txt;
  length.nextElementSibling.dataset.diff = opt.dataset.txt;
  localStorage.setItem('vagabondage@length', length.value);
});
length.value = localStorage.getItem('vagabondage@length') || 10;
length.dispatchEvent(new Event('change'));

// Level
level.addEventListener('change', () => {
  localStorage.setItem('vagabondage@level', level.value);
  level.parentNode.querySelector('span').innerText = level.value;
})
level.value = localStorage.hasOwnProperty('vagabondage@level') ? parseInt(localStorage.getItem('vagabondage@level')) || 10 : 10;
level.parentNode.querySelector('span').innerText = level.value;

// Add season month (@TODO)
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

// Start playing when done
dialog.once('hide', () => {
  game.load(region.value, parseInt(length.value), parseInt(level.value), month.value);
})
