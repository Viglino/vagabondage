import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import 'ol-ext/util/View'
import element from 'ol-ext/util/element';

import dialog, { info } from '../map/dialog';
import map from '../map/map'
import vectorLoader from '../vectorLoader/vectorLoader';
import game from '../game'
import layer from '../map/layer';

import intro from './intro.html'
import { clcInfo } from '../vectorLoader/mapLoader';

import regions from '../vectorLoader/regions'

import { computeDestinationPoint } from 'ol-ext/geom/sphere'
import { fromLonLat, toLonLat } from 'ol/proj';
import { getCenter } from 'ol/extent';

import './intro.css'
import { getDistance } from 'ol/sphere';

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
  vectorLoader.getCountryside(region.value, (c) => {
    vectorLoader.getRoad(c, road => {
      let status = {};
      // Found any road?
      if (road) {
        c = road.getGeometry().getFirstCoordinate();
        const land = vectorLoader.source.clc.getClosestFeatureToCoordinate(c);
        console.log(road.getProperties(), land.getProperties())
        status = {
          route: road.get('cpx_classement_administratif')+' '+road.get('cpx_numero')+' - '+road.get('cpx_gestionnaire'),
          nature: road.get('nature')+' - '+road.get('sens_de_circulation'),
          vitesse: road.get('vitesse_moyenne_vl')+' km/h',
          importance: road.get('importance'),
          paysage: clcInfo[land.get('code_18')].title + ' ('+land.get('code_18')+')'
        };
        info.status(status)
      } else {
        console.log('no road...')
      }

      // Get destination
      let finish;
      vectorLoader.getBuilding(() => {
        return fromLonLat(computeDestinationPoint(toLonLat(c), 10000 + 5000*Math.random(), Math.random()*2*Math.PI));
      }, building => {
        finish = window.finish = getCenter(building.getGeometry().getExtent());
        layer.getSource().addFeature(building);
        layer.getSource().addFeature(new Feature(new Point(finish)));
        //vectorLoader.setCenter(finish)
//        vectorLoader.setActive(['route','bati']);
        console.log((getDistance(toLonLat(c), toLonLat(finish))/1000).toFixed(1) + 'km')
        status.destination = (getDistance(toLonLat(c), toLonLat(finish))/1000).toFixed(1) + 'km';
        vectorLoader.getRouting(c, finish, result => {
          layer.getSource().addFeature(result.feature);
          console.log(result)
          status['distance'] = (result.distance/1000).toFixed(1)+'km';
          const h = Math.floor(result.duration / 60)
          status['temps estimé'] = h+'h'+Math.round(result.duration-h*60);
          info.status(status)
        });
        dialog.hide();

        // Set center
        layer.getSource().addFeature(new Feature(new Point(c)));
        // vectorLoader.setCenter(c);
        dialog.hide();

        // Zoom to start
        map.getView().flyTo({
          type: 'moveTo',
          center: c,
          zoom: 17,
          zoomAt: map.getView().getZoom() - .1
        }, () => {
          game.dispatchEvent('start');
        });
      })
    })
  })
})

/* DEBUG */
window.vectorLoader = vectorLoader
/**/