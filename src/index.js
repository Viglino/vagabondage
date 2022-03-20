import map from './map/map'
import './map/layer'

import './index.css'
import './page/intro'

import './map/vectorloader'

import game from './game'

game.on('start', console.log)

/* Debug */
window.map = map;
/**/