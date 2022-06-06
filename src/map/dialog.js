import map from "./map";
import Dialog from 'ol-ext/control/Dialog'
import Status from 'ol-ext/control/Status'
import ol_ext_element from "ol-ext/util/element";

// Dialog 
const dialog = new Dialog({
  target: document.body
});
map.addControl(dialog);

/** Add info to a dialog */
dialog.setInfo = function(i) {
  let elt = dialog.getContentElement().querySelector('.info') || ol_ext_element.create('DIV', {
    className: 'info',
    parent: dialog.getContentElement()
  })
  if (i===1) {
    elt.innerHTML = '';
    elt.classList.add('newLife')
    setTimeout(() => elt.classList.remove('newLife'), 1500);
  } else {
    elt.innerHTML = i || '';
  }
}

// Status information
const info = new Status;
info.setVisible(true);
// map.addControl(info);

export { info }
export default dialog