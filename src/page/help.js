import ol_ext_element from 'ol-ext/util/element'
import './help-main.css'
import mainHelp from './help-main.html'

const help = {};
let callback = null;

// Help div
help.main = ol_ext_element.create('DIV', {
  id: 'mainHelp',
  className: 'helpPage',
  html: mainHelp,
  click: nextStep,
  parent: document.body
})
document.body.appendChild(help.main)

/** Show help */
function showHelp(h, step) {
  if (!localStorage.getItem('vagabond@help-'+h)) {
    document.querySelectorAll('.helpPage.visible').forEach(d => d.classList.remove('visible'));
    help[h].classList.add('visible');
    help[h].dataset.step = step || 1;
    localStorage.setItem('vagabond@help-'+h, 1)
  }
  callback = null;
  return {
    then: function(cbak) {
      if (document.querySelector('.helpPage.visible')) {
        callback = cbak;
      } else {
        cbak();
      }
    }
  }
}

/** Next help step */
function nextStep() {
  const h = document.querySelector('.helpPage.visible');
  const step = parseInt(h.dataset.step);
  if (document.querySelector('.step-'+(step+1), h)) {
    h.dataset.step = step+1;
  } else {
    h.classList.remove('visible');
    if (callback) callback();
  }
}

/** Hide help */
function hideHelp(h) {
  help[h].classList.remove('visible');
}

/** handle help */
export default {
  show: showHelp,
  hide: hideHelp
}