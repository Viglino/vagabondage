import dialog from '../map/dialog'
import legendHTML from './legend.html'
import './legend.css'

const pages = {};

pages.showLegend = function(help) {
  dialog.show({
    className: 'legendDialog',
    title: 'Légende',
    content: legendHTML
  })
  if (help) {
    dialog.getContentElement().classList.add('help');
    dialog.getContentElement().classList.add('help1');
    document.querySelector('.ol-content').scrollTop = 300;
    let step = 1;
    const topStep = [0, 300, 1400, 4000]
    document.querySelector('.ol-content').addEventListener('click', () => {
      dialog.getContentElement().classList.remove('help' + step);
      step++;
      if (step >= topStep.length) {
        dialog.getContentElement().classList.remove('help');
        return;
      }
      dialog.getContentElement().classList.add('help' + step);
      document.querySelector('.ol-content').scrollTop = topStep[step];
    })
  }
}

export default pages