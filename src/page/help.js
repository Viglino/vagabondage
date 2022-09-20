import mainHelp from './help-main.html'
import Help from '../game/Help'

import './help-main.css'

// New help page
const help = new Help({
  className: 'main',
  content: mainHelp,
})


export default help;
