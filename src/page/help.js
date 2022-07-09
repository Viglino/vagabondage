import olObject from 'ol/Object'
import ol_ext_element from 'ol-ext/util/element'
import './help-main.css'
import mainHelp from './help-main.html'
import Help from '../game/Help'

const help = new Help({
  className: 'helpPage',
  content: mainHelp,
})

window.help = help;

export default help;
