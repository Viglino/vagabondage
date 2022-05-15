import ol_control_Button from 'ol-ext/control/Button'
import map from '../map/map'
import dialog from '../map/dialog';
import _T from '../i18n/i18n';
import game from './game'
import actionsPlaces from './actionsPlaces'

import './actions.css'
import dglAction from './actions.html'

const doneFeatures = {};

/** Get action arround position */
function getActions(arround) {
  const actions = {};
  // Search action places
  for (let a in actionsPlaces) {
    actionsPlaces[a].forEach(i => {
      let arr;
      if (i.test) {
        for (let k in arround) {
          if (i.test(k)) {
            arr = arround[k]
            break;
          }
        }
      } else {
        arr = arround[i];
      }
      // is arround
      if (arr) {
        // not allready done !
        const cleabs = arr[0].cleabs;
        if (!doneFeatures[cleabs]) {
          actions[a] = arr[i];
        }
      }
    })
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
    content: dglAction,
    buttons: [_T('cancel')]
  })
  const dlg = dialog.getContentElement();

  delete dlg.dataset.hasAction;
  Object.keys(actions).forEach(a => {
    let action = actions[a];
    if (action) {
      const elt = dlg.querySelector('[data-action="'+a+'"]');
      if (elt) {
        elt.style.display = 'block';
        const nature =  elt.querySelector('span');
        if (nature) nature.innerText = action[0].nature.toLocaleLowerCase();
        dlg.dataset.hasAction = '';
      }
    }
  })
}


const actionBt = new ol_control_Button({
  className: 'actions',
  title: _T('lookArround'),
  handleClick: doAction
})

map.addControl(actionBt);

export default actionBt
