import ol_control_Button from 'ol-ext/control/Button';
import ol_ext_element from 'ol-ext/util/element';
import Collection from 'ol/Collection';
import _T from '../i18n/i18n';
import dialog from '../map/dialog';
import map from '../map/map';

import './bag.css'
import game from './game';

const bag = new Collection();

bag.fill = function() {
  let n = 0;
  this.forEach(o => {
    if (o.object==='bottle') {
      o.object = 'fullbottle';
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
  title: 'Ton sac...',
  handleClick: () => {
    const ul = ol_ext_element.create('UL')
    dialog.show({
      title: 'le sac',
      content: ul
    })
    if (bag.getLength()) {
      bag.forEach(o => {
        const li = ol_ext_element.create('LI', {
          html: (o.title || _T('type:' + o.type)) + ' ' + (o.object ? _T('object:' + o.object) : ''),
          parent: ul
        })
        let action;
        switch (o.type) {
          case 'food': {
            action = 'manger'; 
            break;
          }
          case 'object': {
            if (o.object === 'fullbottle') action = 'boire';
            break;
          } 
          default: break;
        }
        if (action) {
          const bt = ol_ext_element.create('BUTTON', {
            'data-type': o.type,
            text: action,
            click: () => {
              switch(o.type) {
                case 'food': {
                  if (game.setLife('food')) {
                    li.remove();
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
        }
      })
    } else {
      ol_ext_element.create('LI', {
        html: 'Ton sac est vide pour l\'instant...',
        parent: ul
      })
    }
  }
})
map.addControl(ctrlBag);

export default bag

/* DEBUG */
window.bag = bag;
/**/