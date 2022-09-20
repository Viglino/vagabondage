import dialog from '../map/dialog'
import helpInfo from '../game/helpInfo';

import legendHTML from './legend.html'
import legendHelpHTML from './legendHelp.html'
import './legend.css'

const pages = {};

pages.showLegend = function() {
  dialog.show({
    className: 'legendDialog',
    title: 'Légende',
    content: legendHTML
  })
  document.querySelector('.ol-content').scrollTop = 0;
}

helpInfo.create('legend2', 'retrouve la légende ici...');

pages.showHelpLegend = function() {
  dialog.show({
    className: 'legendDialog smooth',
    title: 'Légende',
    content: legendHelpHTML
  })
  // Help steps
  dialog.getContentElement().classList.add('help');
  dialog.getContentElement().classList.add('help1');
  document.querySelector('.ol-content').scrollTop = 200;
  let step = 1;
  const topStep = [0, 200, 1300, 4000]
  document.querySelector('.ol-content > div.help').addEventListener('click', () => {
    dialog.getContentElement().classList.remove('help' + step);
    step++;
    if (step >= topStep.length) {
      dialog.getContentElement().classList.remove('help');
      dialog.close();
      helpInfo.show('legend2');
      return;
    }
    dialog.getContentElement().classList.add('help' + step);
    document.querySelector('.ol-content').scrollTop = topStep[step];
  })
}

export default pages