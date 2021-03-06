import _T from "../i18n/i18n";

/** Get water message (on 'nature' property)
 * @param {Feature} feature ol Feature
 * @returns {string}
 */
function getWater(feature) {
  const nature = feature.get('nature');
  if (/ecoulement/i.test(nature)) {
    return _T('noCrossing:river');
  } else if (/plan d'eau|réservoir|retenue/i.test(nature)) {
    return _T('noCrossing:water');
  } else {
    switch (nature) {
      case 'Canal':
      case 'Delta':
      case 'Glacier, névé':
      case 'Lac':
      case 'Marais':
        return _T('noCrossing:waterm1') + nature.split(',')[0].toLocaleLowerCase() + '...';
      case 'Aqueduc':
        case 'Estuaire':
          return _T('noCrossing:waterm2') + nature.toLocaleLowerCase() + '...';
        case 'Lagune':
      case 'Mangrove':
      case 'Mare':
      case 'Ravine':
        return _T('noCrossing:waterf') + nature.toLocaleLowerCase() + '...';
      default:
        return _T('noCrossing:water');
    }
  }
}

/** Get intersection message
 * @param {object}
 * @return {Array<string>}
 */
function getIntersection(intersect) {
  if (intersect.feature.troncon_de_route) {
    return ['road', _T('noCrossing:road')];
  } else if (intersect.feature.batiment) {
    return ['building', _T('noCrossing:building')];
  } else if ((intersect.feature.surface_hydrographique || intersect.feature.troncon_hydrographique)
    && !intersect.bridge) {
    return ['water', getWater(intersect.feature.surface_hydrographique || intersect.feature.troncon_hydrographique)];
  } else if (intersect.feature.troncon_de_voie_ferree) {
    return ['rail', _T('noCrossing:rail')];
  }  
}

export { getWater, getIntersection }