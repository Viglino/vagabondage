import ol_control_Button from 'ol-ext/control/Button';
import ol_ext_element from 'ol-ext/util/element';
import Collection from 'ol/Collection';
import dialog from '../map/dialog';
import map from '../map/map';

import './bag.css'
import game from './game';

const bag = new Collection();

bag.fill = function() {
  let n = 0;
  this.forEach(o => {
    if (o.type==='bottle') {
      o.type = 'fillbottle';
      n++;
    }
  })
  return !!n;
}
    
bag.on(['add', 'remove'], () => {
  info.innerHTML = bag.getLength();
  info.dataset.size = bag.getLength();
});

const info = ol_ext_element.create('SPAN', { 'data-size': 0 });
const ctrlBag = new ol_control_Button({
  className: 'bag',
  html: info,
  handleClick: () => {
    const ul = ol_ext_element.create('UL')
    dialog.show({
      title: 'le sac',
      content: ul
    })
    bag.forEach(o => {
      const li = ol_ext_element.create('LI', {
        html: o.title + (o.type==='bottle' ? '( vide)' : o.type==='fullbottle' ? ' (pleine)' : ''),
        parent: ul
      })
      const bt = ol_ext_element.create('BUTTON', {
        'data-type': o.type,
        click: () => {
          switch(o.type) {
            case 'food': {
              if (game.setLife('food')) {
                bt.remove();
              }
              break;
            }
            case 'fullbottle': {
              if (game.setLife('hydro')) {
                o.type = 'bottle';
                bt.dataset.type = o.type;
              };
              break;
            }
          }
        },
        parent: li
      })
    })
  }
})
map.addControl(ctrlBag);

export default bag
