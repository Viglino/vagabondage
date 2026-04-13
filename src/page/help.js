import mainHelp from './help-main.html'
import Help from '../game/Help'
import applyI18n from '../i18n/applyI18n'

import './help-main.css'

// New help page
const help = new Help({
  className: 'main',
  content: mainHelp,
})
applyI18n(help.element);


export default help;
