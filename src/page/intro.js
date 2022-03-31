import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import 'ol-ext/util/View'
import element from 'ol-ext/util/element';
import { toLonLat } from 'ol/proj';
import { getDistance } from 'ol/sphere';

import dialog, { info } from '../map/dialog';
import map from '../map/map'
import vectorLoader from '../vectorLoader/vectorLoader';
import game from '../game'
import layer from '../map/layer';

import { clcInfo } from '../vectorLoader/mapLoader';

import regions from '../vectorLoader/regions'

import intro from './intro.html'
import './intro.css'

// Show g intro
dialog.show({
  content: intro,
  className: 'intro',
  closeBox: false,
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
  vectorLoader.loadGame(region.value, g => {
    const status = {
      route: g.road.get('cpx_classement_administratif') + ' '
        + g.road.get('cpx_numero') + ' - '
        + g.road.get('cpx_gestionnaire'),
      nature: g.road.get('nature') + ' - ' + g.road.get('sens_de_circulation'),
      vitesse: g.road.get('vitesse_moyenne_vl') + ' km/h',
      importance: g.road.get('importance'),
      paysage: clcInfo[g.land.get('code_18')].title + ' ('+g.land.get('code_18')+')',
      destination: (getDistance(toLonLat(g.start), toLonLat(g.end))/1000).toFixed(1) + 'km'
    };
    //layer.getSource().addFeature(g.road);
    layer.getSource().addFeature(new Feature({
      start: true,
      geometry: new Point(g.start)
    }));
    const geom = g.road.getGeometry().getCoordinates();
    const dx = geom[1][0] - geom[0][0]
    const dy = geom[1][1] - geom[0][1]
    const a = Math.PI/2 + Math.atan2(-dy,dx);
    const offset = g.road.get('importance') == 3 ? 5 : 3;
    const dp = [
      g.start[0] + offset * Math.cos(a),
      g.start[1] - offset * Math.sin(a)
    ]
    const f = new Feature({ 
      car: true, 
      rot: a,
      geometry: new Point(dp)
    });
    layer.getSource().addFeature(f);
    layer.getSource().addFeature(new Feature({
      end: true,
      geometry: new Point(g.end)
    }));
    layer.getSource().addFeature(g.building);

    vectorLoader.getRouting(g.start, g.end, result => {
      layer.getSource().addFeature(result.feature);
      status['distance'] = (result.distance/1000).toFixed(1)+'km';
      const h = Math.floor(result.duration / 60)
      status['temps estimé'] = h+'h'+('0'+Math.floor(result.duration-h*60)).substr(-2);
      info.status(status)
    });
    dialog.hide();

    // Set center
    layer.getSource().addFeature(new Feature(new Point(g.start)));

    // Zoom to start
    map.getView().flyTo({
      type: 'moveTo',
      center: g.start,
      zoom: 17,
      zoomAt: map.getView().getZoom() - .1
    }, () => {
      game.start();
    });
  })
})

/* DEBUG */
window.vectorLoader = vectorLoader
/**/