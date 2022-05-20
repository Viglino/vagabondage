import Gauge from 'ol-ext/control/Gauge'

import dialog from '../map/dialog';
import gaugeInfo from './gauge.html'

const gauge = new Gauge({
  title: '+6', 
  max: 8,
  val: 8
});
gauge.element.addEventListener('click', () => {
  dialog.show({
    title: 'Ton état',
    className: 'life',
    content: gaugeInfo
  })
  const hydro = gauge.get('hydro') ? 0 : 1;
  const food = gauge.get('food') ? 0 : 1;
  dialog.getContentElement().querySelector('.hydro span').innerText = hydro;
  dialog.getContentElement().querySelector('.hydro p').classList[hydro ? 'remove' : 'add']('visible');
  dialog.getContentElement().querySelector('.food span').innerText = food;
  dialog.getContentElement().querySelector('.food p').classList[food ? 'remove' : 'add']('visible');
  const nlife = gauge.val() - 2 - hydro - food;
  dialog.getContentElement().querySelector('.rest span').innerText = nlife > 0 ? nlife : 0;
  dialog.getContentElement().querySelector('.rest').classList[nlife > 1 ? 'add' : 'remove']('multi');
  dialog.getContentElement().querySelector('.rest p').classList[nlife < 4 ? 'add' : 'remove']('visible');
  dialog.getContentElement().querySelector('.inan').classList[nlife <= 0 ? 'add' : 'remove']('visible');
})

export default gauge;