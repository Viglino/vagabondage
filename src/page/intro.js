import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import 'ol-ext/util/View'
import element from 'ol-ext/util/element';
import { toLonLat } from 'ol/proj';
import { getDistance } from 'ol/sphere';

import dialog, { info } from '../map/dialog';
import map from '../map/map'
import vectorLoader from '../vectorLoader/vectorLoader';
import Game from '../game'
import layer from '../map/layer';

import { clcInfo } from '../vectorLoader/mapLoader';

import regions from '../vectorLoader/regions'

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
// Add option
regions.forEach((f, i) => {
  element.create('OPTION', { text: f.get('nom'), value: i, parent: region });
});
region.value = Math.floor(Math.random() * regions.length);

// Start playing
dialog.once('hide', () => {
  vectorLoader.loadGame(region.value, game => {
    const status = {
      route: game.road.get('cpx_classement_administratif') + ' '
        + game.road.get('cpx_numero') + ' - '
        + game.road.get('cpx_gestionnaire'),
      nature: game.road.get('nature') + ' - ' + game.road.get('sens_de_circulation'),
      vitesse: game.road.get('vitesse_moyenne_vl') + ' km/h',
      importance: game.road.get('importance'),
      paysage: clcInfo[game.land.get('code_18')].title + ' ('+game.land.get('code_18')+')',
      destination: (getDistance(toLonLat(game.start), toLonLat(game.end))/1000).toFixed(1) + 'km'
    };
    //layer.getSource().addFeature(game.road);
    layer.getSource().addFeature(new Feature(new Point(game.start)));
    const geom = game.road.getGeometry().getCoordinates();
    const dx = geom[1][0] - geom[0][0]
    const dy = geom[1][1] - geom[0][1]
    const a = Math.PI/2 + Math.atan2(-dy,dx);
    const offset = game.road.get('importance') == 3 ? 5 : 3;
    const dp = [
      game.start[0] + offset * Math.cos(a),
      game.start[1] - offset * Math.sin(a)
    ]
    const f = new Feature({ 
      car: true, 
      rot: a,
      geometry: new Point(dp)
    });
    layer.getSource().addFeature(f);
    layer.getSource().addFeature(new Feature(new Point(game.end)));
    layer.getSource().addFeature(game.building);

    vectorLoader.getRouting(game.start, game.end, result => {
      layer.getSource().addFeature(result.feature);
      status['distance'] = (result.distance/1000).toFixed(1)+'km';
      const h = Math.floor(result.duration / 60)
      status['temps estimé'] = h+'h'+('0'+Math.floor(result.duration-h*60)).substr(-2);
      info.status(status)
    });
    dialog.hide();

    // Set center
    layer.getSource().addFeature(new Feature(new Point(game.start)));

    // Zoom to start
    map.getView().flyTo({
      type: 'moveTo',
      center: game.start,
      zoom: 17,
      zoomAt: map.getView().getZoom() - .1
    }, () => {
      Game.dispatchEvent('start');
    });
  })
})

/* DEBUG */
window.vectorLoader = vectorLoader
/**/