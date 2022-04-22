import Button from 'ol-ext/control/Button'
import map from '../map/map'
import dialog from '../map/dialog'

import './about.css'
import './github-corner.css'
import aboutTxt from './about.html'
import _T from '../i18n/i18n'

map.addControl(new Button({
  className: 'about',
  html: 'i',
  handleClick: () => {
    dialog.show({
      className: 'about',
      content: aboutTxt,
      closeBox: false,
      buttons: { cancel: _T('close') }
    })
  }
}));
