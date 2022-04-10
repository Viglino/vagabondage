import dialog from '../map/dialog'
import legendHTML from './legend.html'
import './legend.css'

const pages = {};

pages.showLegend = function() {
  dialog.show({
    className: 'legendDialog',
    title: 'Légende',
    content: legendHTML
  })
}

window.pages = pages

export default pages