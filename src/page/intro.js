import GeoJSON from 'ol/format/GeoJSON'
import Ajax from 'ol-ext/util/Ajax';
import element from 'ol-ext/util/element';
import 'ol-ext/util/View'

import dialog from '../map/dialog';
import map from '../map/map'
import vectorLoader from '../vectorLoader/vectorLoader';
import game from '../game'

import intro from './intro.html'

import './intro.css'

// Start game
dialog.show({
  content: intro,
  className: 'intro',
  buttons: ['Commencer le jeu']
})
const region = dialog.getContentElement().querySelector('SELECT');
// region.addEventListener('change', () => dialog.close());

/** Get random point inside polygon
 * @param {ol/geom/Polygon} g
 * @return {ol/coordinate}
 */
function getCoordinateInside(g) {
  const extent = g.getExtent();
  while (true) {
    const c = [
      extent[0] + Math.random() * (extent[2]-extent[0]),
      extent[1] + Math.random() * (extent[3]-extent[1])
    ]
    if (g.intersectsCoordinate(c)) return c;
  }
}

function wait(e) {
  dialog.show({ 
    content: 'Chargement des données...',
    progress: e.nb,
    max: e.max
  })
}


// Start playing
dialog.once('hide', () => {
  let c = getCoordinateInside(features[region.value].getGeometry());
  vectorLoader.on('loading', wait)
  vectorLoader.setCenter(c)
  vectorLoader.setActive(['route','clc'/*,'bati'*/]);
  // Zoom to start
  vectorLoader.once('ready', () =>{
    // Get closest road
    let road;
    let importance = 6;
    vectorLoader.source.route.getFeatures().forEach(f => {
      if (/route/i.test(f.get('nature')) && f.get('importance') < importance) {
        road = f;
        importance = parseInt(f.get('importance'))
      }
    });
    if (road) {
      c = road.getGeometry().getFirstCoordinate();
      console.log(road.getProperties())
    }
    // remove handler
    vectorLoader.un('loading', wait)
    dialog.hide();
    vectorLoader.setCenter(c);

    map.getView().flyTo({
      type: 'moveTo',
      center: c,
      zoom: 16,
      zoomAt: map.getView().getZoom() - .1
    }, () => {
      game.dispatchEvent('start');
    });
  })
})

// Load regions
let features;
Ajax.get({
  url: './data/regions.geojson',
  success: (data) => {
    const parser = new GeoJSON;
    features = parser.readFeatures(data, { featureProjection: map.getView().getProjection() });
    features = features.sort((a,b) => {
      const c1 = parseInt(b.get('code'));
      const c2 = parseInt(a.get('code'));
      if (c1 < 10 || c2 < 10) return c1 - c2;
      return (a.get('nom') < b.get('nom') ? -1 : 1);
    })
    // Format features
    features.forEach((f, i) => {
      // Only metropole
      if (parseInt(f.get('code')) < 10) return;
      // Only Polygon (remove islands)
      const g = f.getGeometry();
      if (g.getType() !== 'Polygon') {
        const polys = f.getGeometry().getPolygons();
        let poly, max=0;
        polys.forEach(p => {
          if (p.getFlatCoordinates().length > max) {
            max = p.getFlatCoordinates().length;
            poly = p;
          }
        })
        f.setGeometry(poly);
      }
      // Add option
      element.create('OPTION', { text: f.get('nom'), value: i, parent: region });
    })
    region.value = Math.floor(Math.random()*12);
  }
})
