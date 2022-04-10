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
  111: { color: [230,0,77,255], title: 'Tissu urbain continu'},
  112: { color: [255,0,0,255], title: 'Tissu urbain discontinu'},
  121: { color: [204,77,242,255], title: 'Zones industrielles et commerciales'},
  122: { color: [204,0,0,255], title: 'Réseaux routier et ferroviaire et terrains associés'},
  123: { color: [230,204,204,255], title: 'Zones portuaires'},
  124: { color: [230,204,230,255], title: 'Aéroports'},
  131: { color: [166,0,204,255], title: 'Sites d\'extraction minière'},
  132: { color: [166,77,0,255], title: 'Décharge'},
  133: { color: [255,77,255,255], title: 'Constructions'},
  141: { color: [255,166,255,255], title: 'Zones urbaines vertes'},
  142: { color: [255,230,255,255], title: 'Installations sportives et de loisirs'},
  211: { color: [255,255,168,255], title: 'Terres arables non irriguées'},
  212: { color: [255,255,0,255], title: 'Terre irriguée en permanence'},
  213: { color: [230,230,0,255], title: 'Rizières'},
  221: { color: [230,128,0,255], title: 'Vignobles'},
  222: { color: [242,166,77,255], title: 'Arbres fruitiers et plantations de baies'},
  223: { color: [230,166,0,255], title: 'Oliveraies'},
  231: { color: [230,230,77,255], title: 'Prairies'},
  241: { color: [255,230,166,255], title: 'Cultures annuelles associées aux cultures permanentes'},
  242: { color: [255,230,77,255], title: 'Modèles de culture complexes'},
  243: { color: [230,204,77,255], title: 'Surfaces essentiellement agricoles, avec d\'importants espaces naturels' },
  244: { color: [242,204,166,255], title: 'Territoires agro-forestières'},
  311: { color: [128,255,0,255], title: 'Forêt de feuillus'},
  312: { color: [0,166,0,255], title: 'Forêt de conifères'},
  313: { color: [77,255,0,255], title: 'Forêt mixte'},
  321: { color: [204,242,77,255], title: 'Prairies naturelles'},
  322: { color: [166,255,128,255], title: 'Landes et landes'},
  323: { color: [166,230,77,255], title: 'Végétation sclérophylle'},
  324: { color: [166,242,0,255], title: 'Arbuste boisé de transition'},
  331: { color: [230,230,230,255], title: 'Plages dunes sables'},
  332: { color: [204,204,204,255], title: 'Roches nues'},
  333: { color: [204,255,204,255], title: 'Zones peu végétalisées'},
  334: { color: [0,0,0,255], title: 'Zones incendiées'},
  335: { color: [166,230,204,255], title: 'Glaciers et neiges éternelles'},
  411: { color: [166,166,255,255], title: 'Marais intérieurs'},
  412: { color: [77,77,255,255], title: 'Tourbières'},
  421: { color: [204,204,255,255], title: 'Marais salants'},
  422: { color: [230,230,255,255], title: 'Salines'},
  423: { color: [166,166,230,255], title: 'Plats intertidaux'},
  511: { color: [0,204,242,255], title: 'Cours d\'eau'},
  512: { color: [128,242,230,255], title: 'Plans d\'eau'},
  521: { color: [0,255,166,255], title: 'Lagunes côtières'},
  522: { color: [166,255,230,255], title: 'Estuaires'},
  523: { color: [230,242,255,255], title: 'Mer et océan'},
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
