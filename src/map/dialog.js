import map from "./map";
import Dialog from 'ol-ext/control/Dialog'
import Status from 'ol-ext/control/Status'

// Dialog 
const dialog = new Dialog({
  target: document.body
});
map.addControl(dialog);

// Status information
const info = new Status;
info.setVisible(true);
// map.addControl(info);

export { info }
export default dialog