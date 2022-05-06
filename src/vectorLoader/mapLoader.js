import ol_ext_element from 'ol-ext/util/element';
import Map from 'ol/Map'
import View from 'ol/View'
import Geoportail from 'ol-ext/layer/Geoportail'

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
  111: { color: [230,0,77,255], title: 'tissu urbain continu', biome: 'en ville' },
  112: { color: [255,0,0,255], title: 'tissu urbain discontinu', biome: 'dans cette banlieue' },
  121: { color: [204,77,242,255], title: 'zones industrielles et commerciales', biome: 'en pleine zone industrielle' },
  122: { color: [204,0,0,255], title: 'réseaux routier et ferroviaire et terrains associés', biome: 'en ville' },
  123: { color: [230,204,204,255], title: 'zones portuaires', biome: 'sur le port' },
  124: { color: [230,204,230,255], title: 'aéroports', biome: 'à côté d\'un aéroport' },
  131: { color: [166,0,204,255], title: 'sites d\'extraction minière', biome: 'à côté d\'une mine' },
  132: { color: [166,77,0,255], title: 'décharge', biome: 'à côté d\'une décharge' },
  133: { color: [255,77,255,255], title: 'constructions', biome: 'en ville' },
  141: { color: [255,166,255,255], title: 'zones urbaines vertes', biome: 'en ville' },
  142: { color: [255,230,255,255], title: 'installations sportives et de loisirs', biome: 'en ville' },
  211: { color: [255,255,168,255], title: 'terres arables non irriguées', biome: 'en pleine campagne'},
  212: { color: [255,255,0,255], title: 'terre irriguée en permanence', biome: 'au milieu des cultures'},
  213: { color: [230,230,0,255], title: 'rizières', biome: 'dans les rizères'},
  221: { color: [230,128,0,255], title: 'vignobles', biome: 'au milieu des vignes'},
  222: { color: [242,166,77,255], title: 'orbres fruitiers et plantations de baies', biome: 'au milieu des vergers'},
  223: { color: [230,166,0,255], title: 'oliveraies', biome: 'dans les oliveraies'},
  231: { color: [230,230,77,255], title: 'prairies', biome: 'en pleine campagne'},
  241: { color: [255,230,166,255], title: 'cultures annuelles associées aux cultures permanentes', biome: 'en pleine campagne'},
  242: { color: [255,230,77,255], title: 'modèles de culture complexes', biome: 'en pleine campagne'},
  243: { color: [230,204,77,255], title: 'surfaces essentiellement agricoles, avec d\'importants espaces naturels', biome: 'en pleine nature'},
  244: { color: [242,204,166,255], title: 'territoires agro-forestières', biome: 'en pleine campagne'},
  311: { color: [128,255,0,255], title: 'forêt de feuillus', biome: 'au milieu de la forêt'},
  312: { color: [0,166,0,255], title: 'forêt de conifères', biome: 'au milieu de la forêt'},
  313: { color: [77,255,0,255], title: 'forêt mixte', biome: 'au milieu de la forêt'},
  321: { color: [204,242,77,255], title: 'prairies naturelles', biome: 'en pleine campagne'},
  322: { color: [166,255,128,255], title: 'landes', biome: 'dans les landes'},
  323: { color: [166,230,77,255], title: 'végétation sclérophylle', biome: 'en pleine forêt'},
  324: { color: [166,242,0,255], title: 'arbuste boisé de transition', biome: 'en pleine campagne'},
  331: { color: [230,230,230,255], title: 'plages dunes sables', biome: 'dans les dunes'},
  332: { color: [204,204,204,255], title: 'roches nues', biome: 'au milieu des rochers'},
  333: { color: [204,255,204,255], title: 'zones peu végétalisées', biome: 'au milieu des rochers'},
  334: { color: [0,0,0,255], title: 'zones incendiées', biome: 'en pleine forêt'},
  335: { color: [166,230,204,255], title: 'glaciers et neiges éternelles', biome: 'dans les glaciers'},
  411: { color: [166,166,255,255], title: 'marais intérieurs', biome: 'au lilieu des marais'},
  412: { color: [77,77,255,255], title: 'tourbières', biome: 'au lilieu des tourbières'},
  421: { color: [204,204,255,255], title: 'marais salants', biome: 'en plein marais salants'},
  422: { color: [230,230,255,255], title: 'salines', biome: 'dans les salines'},
  423: { color: [166,166,230,255], title: 'plats intertidaux', biome: 'en plaine campagne'},
  511: { color: [0,204,242,255], title: 'cours d\'eau', biome: 'au bord d\'une rivière'},
  512: { color: [128,242,230,255], title: 'plans d\'eau', biome: 'au bord d\'un lac'},
  521: { color: [0,255,166,255], title: 'lagunes côtières', biome: 'au bord d\'une lagune'},
  522: { color: [166,255,230,255], title: 'estuaires', biome: 'au bord de mer'},
  523: { color: [230,242,255,255], title: 'mer et océan', biome: 'au bord de mer'}
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
