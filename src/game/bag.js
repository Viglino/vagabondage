import ol_control_Button from 'ol-ext/control/Button';
import ol_ext_element from 'ol-ext/util/element';
import Collection from 'ol/Collection';
import _T from '../i18n/i18n';
import dialog from '../map/dialog';
import map from '../map/map';

import './bag.css'
import game from './game';
import helpInfo from './helpInfo';

// The bag
const bag = new Collection();

// Help bag
helpInfo.create('bag', 'ce que tu trouve sur le chemin<br/>est rangé dans ton sac...')

// Show what's in the bag
dialog.on('hide', () => {
  if (dialog.element.classList.contains('actions') && bag.getLength()) {
    helpInfo.show('bag');
  }
})

/** Fill water containers
 */
bag.fillWater = function() {
  let n = 0;
  this.forEach(o => {
    if (o.object==='bottle') {
      o.object = 'fullbottle';
      n++;
    }
  })
  return !!n;
}

/** Show bag dialog
 */
bag.show = function() {
  const ul = ol_ext_element.create('UL');
  dialog.show({
    title: 'sac à dos',
    className: 'bag',
    buttons: ['ok'],
    content: ul
  })
  // Nothing to show
  if (!bag.getLength())  {
    ol_ext_element.create('LI', {
      className: 'empty',
      html: ol_ext_element.create('P', {
        html: 'Ton sac est vide pour l\'instant...'
      }),
      parent: ul
    })
    return;
  }
  // Show bag content
  bag.forEach(o => {
    // New object in the bag list
    const li = ol_ext_element.create('LI', {
      html: ol_ext_element.create('P', {
        html: (o.title || _T('type:' + o.type)) + ' ' + (o.object ? _T('object:' + o.object) : '')
      }),
      className: o.object || o.what || o.type,
      parent: ul
    })
    // Remove object in the bag
    ol_ext_element.create('BUTTON', {
      className: 'delete',
      title: 'jeter cet objet',
      click: () => {
        bag.remove(o);
        li.remove();
      },
      parent: li
    })
    // Set action on object
    let action;
    switch (o.type) {
      case 'food': {
        action = 'eating'; 
        break;
      }
      case 'object': {
        if (o.object === 'fullbottle') action = 'drinking';
        break;
      } 
      default: break;
    }
    if (action) {
      const bt = ol_ext_element.create('BUTTON', {
        'data-type': o.type,
        text: _T(action),
        click: () => {
          // Reset
          dialog.setInfo();
          switch(action) {
            case 'eating': {
              if (game.setLife('food')) {
                li.remove();
                bag.remove(o);
                dialog.setInfo(+1)
              } else {
                dialog.setInfo('Tu n\'as pas vraiment faim...');
              }
              break;
            }
            case 'drinking': {
              if (game.setLife('hydro')) {
                o.object = 'bottle';
                bt.remove();
                dialog.setInfo(+1)
                li.className = o.object || o.what || o.type
              } else {
                dialog.setInfo('Tu n\'as pas vraiment soif...');
              }
              break;
            }
          }
        },
        parent: li
      })
    }
  })
}
    
const info = ol_ext_element.create('SPAN', { 'data-size': 0 });
bag.on(['add', 'remove'], () => {
  info.innerHTML = bag.getLength();
  info.dataset.size = bag.getLength();
});

const ctrlBag = new ol_control_Button({
  className: 'bag',
  html: info,
  title: 'Ton sac...',
  handleClick: () => {
    helpInfo.hide();
    bag.show();
  }
})
map.addControl(ctrlBag);

export default bag

/* DEBUG */
window.bag = bag;
/**/