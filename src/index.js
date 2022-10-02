// import './page/lock'
import './i18n/lang.js'
import map from './map/map'
import './map/layer'

// CSS
import './index.css'
import 'font-awesome/css/font-awesome.min.css'
import 'font-gis/css/font-gis.css'

// Pages
import './page/intro'
import './page/about'

// Game
import game from './game/game'
import './game/actions'
import './game/keys'
// Edit action places (debug)
import './game/editActions'

/* DEBUG */
window.map = map;
window.game = game;
import actionsPlaces from './game/actionsPlaces.js'
window.actionsPlaces = actionsPlaces;
/**/