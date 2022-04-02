import olObject from 'ol/Object'
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { toLonLat } from 'ol/proj';
import { getDistance } from 'ol/sphere';

import map from './map/map';
import dialog, { info } from './map/dialog';
import { clcInfo } from './vectorLoader/mapLoader';
import vectorLoader from './vectorLoader/vectorLoader';
import layer, { layerCarte } from './map/layer'

/** Game object
 */
class Game extends olObject {
  constructor() {
    super();
    this.map = map
  }
}

/** Load a new game in region
 * @param {string} region region id
 */
Game.prototype.load = function(region) {
  vectorLoader.loadGame(region, g => {
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
    layer.getSource().addFeature(new Feature({ 
      style: 'car', 
      rot: a,
      geometry: new Point(dp)
    }));
    layerCarte.getSource().addFeature(new Feature({
      style: 'end',
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
    layerCarte.getSource().addFeature(new Feature({
      style: 'start',
      geometry: new Point(g.start)
    }));

    // Zoom to start
    this.map.getView().flyTo({
      type: 'moveTo',
      center: g.start,
      zoom: 17,
      zoomAt: map.getView().getZoom() - .1
    }, () => {
      this.start();
    });
  })
}

/** Start a new game
 */
Game.prototype.start = function() {
  this.map.getView().setMinZoom(13.01)
}

const game = new Game;

export default game
