import ol_control_Button from 'ol-ext/control/Button'
import map from '../map/map'
import dialog from '../map/dialog';
import _T from '../i18n/i18n';
import game from './game'

import './actions.css'
import dglAction from './actions.html'

const doneFeatures = {};

const actionsPlaces = {
  info: [
    'construction_ponctuelle-Croix',
  ],
  water: [
    'detail_hydrographique-Fontaine',
    'detail_hydrographique-Citerne',
    'detail_hydrographique-Source captée',
    'detail_hydrographique-Source',
    'detail_hydrographique-Résurgence',
    'detail_hydrographique-Point d\'eau',
    'detail_hydrographique-Lavoir',
    'cimetiere-*',
    'zone_d_activite_ou_d_interet-Camping'
  ],
  sleeping: [
    'zone_d_activite_ou_d_interet-Mégalithe',
    'batiment-Chapelle',
    'batiment-Fort, blockhaus, casemate',
    'zone_d_activite_ou_d_interet-Camping'
  ],
  eating: [
    'batiment-Serre',
    'zone_d_activite_ou_d_interet-Camping'
  ],
  objects: [
    'batiment-Industriel, agricole ou commercial',
    'batiment-Moulin à vent',

  ],
  detente: [
    'zone_d_activite_ou_d_interet-Aire de détente'
  ],
  other: [
      'zone_d_activite_ou_d_interet-Aire de covoiturage *',
      'zone_d_activite_ou_d_interet-*camping*',
      'zone_d_activite_ou_d_interet-*police*',
      'zone_d_activite_ou_d_interet-baraque*',
      'zone_d_activite_ou_d_interet-Boulodrome',
      'zone_d_activite_ou_d_interet-Four à pain',
      'zone_d_activite_ou_d_interet-Gare*',
      'zone_d_activite_ou_d_interet-Parc de stationnement de moins de 25 places',
      'zone_d_activite_ou_d_interet-Parking nommé de moins de 25 places',
      'zone_d_activite_ou_d_interet-Centre équestre',
      'zone_d_activite_ou_d_interet-Aire de détente',
      'zone_d_activite_ou_d_interet-Espace public',
      'equipement_de_transport-Parking',
      'construction_ponctuelle-Eolienne',
      'batiment-Serre',
      'zone_de_vegetation-Bananeraie',
      'zone_de_vegetation-Verger',
      'zone_de_vegetation-Vigne',
  ]
}

/** Get action arround */
function getActions(arround) {
  const actions = {};
  // Search action places
  for (let a in actionsPlaces) {
    actionsPlaces[a].forEach(i => {
      // is arround
      if (arround[i]) {
        // not allready done !
        const cleabs = actions[a][0].cleabs;
        if (!doneFeatures[cleabs]) {
          actions[a] = arround[i];
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

  Object.keys(actions).forEach(a => {
    if (actions[a]) {
      console.log(a)
      const elt = dlg.querySelector('[data-action="'+a+'"]');
      if (elt) {
        elt.style.display = 'block';
        const nature =  elt.querySelector('span');
        if (nature) nature.innerText = actions[a][0].nature.toLocaleLowerCase();
      }
      dlg.dataset.hasAction = '';
    }
  })
}


const actionBt = new ol_control_Button({
  className: 'actions',
  handleClick: doAction
})

map.addControl(actionBt);

export default actionBt
