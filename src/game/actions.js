import ol_control_Button from 'ol-ext/control/Button'
import ol_ext_element from 'ol-ext/util/element';
import map from '../map/map'
import dialog from '../map/dialog';
import _T from '../i18n/i18n';

import './actions.css'
import dglAction from './actions.html'

import game from './game'
import actionsPlaces from './actionsPlaces'
import helpInfo from './helpInfo';

const doneFeatures = {};

/** Get action arround position */
function getActions(arround) {
  const actions = [];
  // Search action places
  for (let place in actionsPlaces) {
    const placeInfo = actionsPlaces[place];
    let arr;
    // use search ?
    if (placeInfo.search) {
      for (let k in arround) {
        if (placeInfo.search.test(k)) {
          arr = arround[k]
          break;
        }
      }
    } else {
      arr = arround[place];
    }
    // is arround?
    if (arr) {
      for (let i=0; i<arr.length; i++) {
        // not allready done !
        if (!doneFeatures[arr[i].cleabs]) {
          actions.push({
            place: arr[i],
            info: placeInfo
          });
        }
      }
    }
  }
  return actions;
}
game.getActions = getActions;

function handleAction(action) {
  const ul = ol_ext_element.create('UL');
  dialog.set('hideOnBack', false);
  dialog.show({
    title: action.place.toponyme || action.info.title,
    className: 'bag place',
    buttons: ['ok'],
    onButton: () => {
      doAction();
    },
    content: ul
  })
  // Done action
  doneFeatures[action.place.cleabs] = true;
  // Show info
  action.info.actions.forEach(actions => {
    const a = actions[Math.floor(Math.random()*actions.length)] || actions[0];
    const types = a.type instanceof Array ? a.type : [a.type];
    const tabAction = { drink: 'boire un coup', water: 'remplir des bouteilles'}
    const li = ol_ext_element.create('LI', {
      html: ol_ext_element.create('P', {
        html: a.desc
      }),
      className: a.object || a.what || types[0] ,
      parent: ul
    });
    if (a.action) {
      const d = ol_ext_element.create('DIV', { className: 'actions', parent: li });
      types.forEach(t => {
        const bt = ol_ext_element.create('BUTTON', {
          'data-type': t,
          text: tabAction[t] || a.action,
          click: () => {
            // Reset
            dialog.setInfo();
            // Add actions
            switch(t) {
              case 'drink': {
                if (game.setLife('hydro')) {
                  dialog.setInfo(+1);
                } else {
                  dialog.setInfo('Tu n\'as pas vraiment soif...');
                }
                break;
              }
              case 'water': {
                if (!game.bag.fillWater()) {
                  dialog.setInfo('Rien à remplir...');
                }
                break;
              }
              case 'info': {
                game.compass++;
                break;
              }
              case 'object': {
                if (a.object==='shoes') {
                  if (game.get('shoes')) {
                    dialog.setInfo(_T('hasShoes'))
                  } else {
                    const n = Math.trunc(Math.random() * (1 + a.nok.length));
                    if (n>0) {
                      dialog.setInfo(a.nok[n-1]);
                    } else {
                      game.setShoes();
                      dialog.setInfo(a.ok);
                    }
                  }
                } else {
                  game.bag.addObject(a);
                }
                break;
              }
              case 'rest': {
                if (game.setLife(+1)) {
                  game.set('duration', (game.get('duration') || 0) + 30);
                  game.getArround();
                  dialog.setInfo(+1);
                } else {
                  dialog.setInfo(_T('noRest'));
                }
                break;
              }
              default: {
                game.bag.addObject(a)
                break;
              }
            }
            bt.remove();
          },
          parent: d
        })
      })
    }
  })
}

/** Do an action */
function doAction() {
  const arround = game.arround || {};
  helpInfo.hide();

  // Check actions
  const actions = getActions(arround)

  dialog.show({
    className: 'actions',
    title: 'Autour de toi',
    hideOnBack: true,
    content: dglAction,
    buttons: [_T('continue')]
  })

  // Add help
  if (game.compass > 0) {
    ol_ext_element.create('BUTTON', {
      html: 'Afficher les points d\'intérêt autour de moi (' + game.compass + ')...',
      click: () => {
        dialog.hide();
        game.showAround();
      },
      parent: dialog.getContentElement()
    })
  }

  const ul = dialog.getContentElement().querySelector('ul');
  actions.forEach(a => {
    let info = a.info['title-'+a.place.usage_1] || a.info.title;
    if (a.place.toponyme) info += ' "'+a.place.toponyme+'"';
    ol_ext_element.create('LI', {
      html: info,
      click: () => {
        handleAction(a);
      },
      parent: ul
    })
  })
  if (actions.length) dialog.getContentElement().dataset.hasAction = '';
  else delete dialog.getContentElement().dataset.hasAction;
}

/* Action button */
const actionBt = new ol_control_Button({
  className: 'actions',
  title: _T('lookArround'),
  handleClick: doAction
})
map.addControl(actionBt);

// Help info
helpInfo.create('arround', 'regarde autour de toi...')

/* Check arround */
game.on('arround', () => {
  // Check actions
  const actions = getActions(game.arround || {})
  if (actions.length) {
    // Ring the button
    actionBt.getButtonElement().classList.add('ring');
    setTimeout(() => actionBt.getButtonElement().classList.remove('ring'), 300);
    // Show help info
    helpInfo.show('arround')
  }
})

export default actionBt
