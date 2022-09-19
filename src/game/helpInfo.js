import ol_ext_element from 'ol-ext/util/element';

import './helpInfo.css'

const helpInfo = {
  // Create a new helpInfo
  create: (help, info) => {
    ol_ext_element.create('DIV', {
      'data-role': 'helpInfo',
      className: help,
      html: info,
      parent: document.body
    })
  },
  // Hide current help info
  hide: () => {
    document.querySelectorAll('[data-role="helpInfo"].visible').forEach(h => {
      h.classList.remove('visible');
    })
  },
  // Show help info
  show: (help) => {
    if (!localStorage.getItem('vagabondage@help-' + help)) {
      document.querySelector('[data-role="helpInfo"].' + help).classList.add('visible');
      setTimeout(() => helpInfo.hide(), 5000);
      // localStorage.setItem('vagabondage@help-' + help, 1)
    }
  },
  // Reset all help info
  reset: () => {
    Object.keys(localStorage).forEach(k => {
      if (/vagabondage@help/.test(k)) localStorage.removeItem(k);
    })
  }
}

export default helpInfo
