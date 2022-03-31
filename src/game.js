import olObject from 'ol/Object'
import map from './map/map';

/** Game object
 */
class Game extends olObject {
  constructor() {
    super();
    this.map = map
  }
}

Game.prototype.start = function() {
  this.map.getView().setMinZoom(13.01)
}

const game = new Game;

export default game
