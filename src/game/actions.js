import ol_control_Button from 'ol-ext/control/Button'
import map from '../map/map'
import dialog from '../map/dialog';
import _T from '../i18n/i18n';

import './actions.css'
import dglAction from './actions.html'

import game from './game'
import actionsPlaces from './actionsPlaces'
import ol_ext_element from 'ol-ext/util/element';

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
          break;
        }
      }
    }
  }
  return actions;
}


/** Do an action */
function doAction() {
  const arround = game.arround || {};

  // Check actions
  const actions = getActions(arround)

  console.log('ACTIONS:', actions)

  dialog.show({
    className: 'actions',
    title: 'Autour de toi :',
    content: dglAction,
    buttons: [_T('cancel')]
  })

  const ul = dialog.getContentElement().querySelector('ul');
  actions.forEach(a => {
    let info = a.info.title;
    if (a.place.toponyme) info += ' "'+a.place.toponyme+'"';
    ol_ext_element.create('LI', {
      html: info,
      parent: ul
    })
  })
  if (actions.length) dialog.getContentElement().dataset.hasAction = '';
  else delete dialog.getContentElement().dataset.hasAction;
}


const actionBt = new ol_control_Button({
  className: 'actions',
  title: _T('lookArround'),
  handleClick: doAction
})

map.addControl(actionBt);

export default actionBt
