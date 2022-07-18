import map from "./map";
import Dialog from 'ol-ext/control/Dialog'
import Status from 'ol-ext/control/Status'
import ol_ext_element from "ol-ext/util/element";

// Dialog 
const dialog = new Dialog({
  target: document.body
});
map.addControl(dialog);

// Bag dialog
const bagDialog = new Dialog({
  target: document.body
});
map.addControl(bagDialog);

// Add info dialog + life on dialog
function setInfoDialog(dialog) {

  // Add life info in the dialog
  const lifeInfo = ol_ext_element.create('DIV', {
    className: 'info',
  });
  dialog.element.querySelector('form').insertBefore(lifeInfo, dialog.element.querySelector('.ol-buttons'));
  // Remove info on hide
  dialog.on('hide', () => lifeInfo.innerHTML = '');

  /** Add info to a dialog */
  dialog.setInfo = function(i) {
    if (i===1) {
      lifeInfo.innerHTML = '';
      lifeInfo.classList.add('newLife')
      setTimeout(() => lifeInfo.classList.remove('newLife'), 1500);
    } else {
      lifeInfo.innerHTML = i || '';
    }
  }
}

// Add info to the dialog
setInfoDialog(dialog)
setInfoDialog(bagDialog)

// Status information
const info = new Status;
info.setVisible(true);

export { info, bagDialog }
export default dialog