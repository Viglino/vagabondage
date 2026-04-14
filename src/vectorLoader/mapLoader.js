import ol_ext_element from 'ol-ext/util/element';
import Map from 'ol/Map'
import View from 'ol/View'
import Geoportail from 'ol-ext/layer/Geoportail'
import _T from '../i18n/i18n'

/** Ghost map to preload layers on extent */
const mapLoader = new Map({
  target: ol_ext_element.create('DIV', { 
    className: 'ghostMap', 
    style: {
      width: '256px',
      height: '256px'
    },
    parent: document.body 
  }),
  view: new View({
    zoom: 14,
    minZoom: 14,
    maxZoom: 17,
    center: [263561.5, 5842622.5]
  }),
  interactions: [],
  controls: [],
});

mapLoader.addLayer(new Geoportail({ layer: 'ORTHOIMAGERY.ORTHOPHOTOS', opacity: 1 }));

/** Biome info */
const clcInfo = {
  111: { color: [230,0,77,255], title: 'tissu urbain continu', get biome() { return _T('biome:inCity'); } },
  112: { color: [255,0,0,255], title: 'tissu urbain discontinu', get biome() { return _T('biome:inSuburbs'); } },
  121: { color: [204,77,242,255], title: 'zones industrielles et commerciales', get biome() { return _T('biome:inIndustrial'); } },
  122: { color: [204,0,0,255], title: 'réseaux routier et ferroviaire et terrains associés', get biome() { return _T('biome:inCity'); } },
  123: { color: [230,204,204,255], title: 'zones portuaires', get biome() { return _T('biome:atPort'); } },
  124: { color: [230,204,230,255], title: 'aéroports', get biome() { return _T('biome:nearAirport'); } },
  131: { color: [166,0,204,255], title: 'sites d\'extraction minière', get biome() { return _T('biome:nearMine'); } },
  132: { color: [166,77,0,255], title: 'décharge', get biome() { return _T('biome:nearDump'); } },
  133: { color: [255,77,255,255], title: 'constructions', get biome() { return _T('biome:inCity'); } },
  141: { color: [255,166,255,255], title: 'zones urbaines vertes', get biome() { return _T('biome:inCity'); } },
  142: { color: [255,230,255,255], title: 'installations sportives et de loisirs', get biome() { return _T('biome:inCity'); } },
  211: { color: [255,255,168,255], title: 'terres arables non irriguées', get biome() { return _T('biome:inCountryside'); } },
  212: { color: [255,255,0,255], title: 'terre irriguée en permanence', get biome() { return _T('biome:inCropland'); } },
  213: { color: [230,230,0,255], title: 'rizières', get biome() { return _T('biome:inRiceFields'); } },
  221: { color: [230,128,0,255], title: 'vignobles', get biome() { return _T('biome:inVineyards'); } },
  222: { color: [242,166,77,255], title: 'orbres fruitiers et plantations de baies', get biome() { return _T('biome:inOrchards'); } },
  223: { color: [230,166,0,255], title: 'oliveraies', get biome() { return _T('biome:inOliveGroves'); } },
  231: { color: [230,230,77,255], title: 'prairies', get biome() { return _T('biome:inCountryside'); } },
  241: { color: [255,230,166,255], title: 'cultures annuelles associées aux cultures permanentes', get biome() { return _T('biome:inCountryside'); } },
  242: { color: [255,230,77,255], title: 'modèles de culture complexes', get biome() { return _T('biome:inCountryside'); } },
  243: { color: [230,204,77,255], title: 'surfaces essentiellement agricoles, avec d\'importants espaces naturels', get biome() { return _T('biome:inNature'); } },
  244: { color: [242,204,166,255], title: 'territoires agro-forestières', get biome() { return _T('biome:inCountryside'); } },
  311: { color: [128,255,0,255], title: 'forêt de feuillus', get biome() { return _T('biome:inForest'); } },
  312: { color: [0,166,0,255], title: 'forêt de conifères', get biome() { return _T('biome:inForest'); } },
  313: { color: [77,255,0,255], title: 'forêt mixte', get biome() { return _T('biome:inForest'); } },
  321: { color: [204,242,77,255], title: 'prairies naturelles', get biome() { return _T('biome:inCountryside'); } },
  322: { color: [166,255,128,255], title: 'landes', get biome() { return _T('biome:inHeathland'); } },
  323: { color: [166,230,77,255], title: 'végétation sclérophylle', get biome() { return _T('biome:inForest'); } },
  324: { color: [166,242,0,255], title: 'arbuste boisé de transition', get biome() { return _T('biome:inCountryside'); } },
  331: { color: [230,230,230,255], title: 'plages dunes sables', get biome() { return _T('biome:inDunes'); } },
  332: { color: [204,204,204,255], title: 'roches nues', get biome() { return _T('biome:inRocks'); } },
  333: { color: [204,255,204,255], title: 'zones peu végétalisées', get biome() { return _T('biome:inRocks'); } },
  334: { color: [0,0,0,255], title: 'zones incendiées', get biome() { return _T('biome:inForest'); } },
  335: { color: [166,230,204,255], title: 'glaciers et neiges éternelles', get biome() { return _T('biome:inGlaciers'); } },
  411: { color: [166,166,255,255], title: 'marais intérieurs', get biome() { return _T('biome:inMarsh'); } },
  412: { color: [77,77,255,255], title: 'tourbières', get biome() { return _T('biome:inPeatBogs'); } },
  421: { color: [204,204,255,255], title: 'marais salants', get biome() { return _T('biome:inSaltMarshes'); } },
  422: { color: [230,230,255,255], title: 'salines', get biome() { return _T('biome:inSaltPans'); } },
  423: { color: [166,166,230,255], title: 'plats intertidaux', get biome() { return _T('biome:inCountryside'); } },
  511: { color: [0,204,242,255], title: 'cours d\'eau', get biome() { return _T('biome:byRiver'); } },
  512: { color: [128,242,230,255], title: 'plans d\'eau', get biome() { return _T('biome:byLake'); } },
  521: { color: [0,255,166,255], title: 'lagunes côtières', get biome() { return _T('biome:byLagoon'); } },
  522: { color: [166,255,230,255], title: 'estuaires', get biome() { return _T('biome:bySea'); } },
  523: { color: [230,242,255,255], title: 'mer et océan', get biome() { return _T('biome:bySea'); } }
};

/* DEBUG: Show info on hover */
import Hover from 'ol-ext/interaction/Hover'
import Tooltip from 'ol-ext/overlay/Tooltip'
import map from '../map/map';
// import geoportailStyle from 'ol-ext/style/geoportailStyle'

// const clcInfo = geoportailStyle.clcColors;
const tooltip = new Tooltip();
mapLoader.addOverlay(tooltip);

const hover = new Hover;
mapLoader.addInteraction(hover);
hover.on('enter', e => {
  const f = e.feature;
  const info = clcInfo[f.get('code_18')];
  tooltip.setInfo(info ? info.title : (f.get('usage_1') ? 'bati: ' + f.get('usage_1') +' - '+ f.get('nature') : f.get('nature')))
  //console.log(e.feature.getProperties())
})
hover.on('leave', e => {
  tooltip.setInfo()
})
/**/

export { clcInfo }
export default mapLoader
