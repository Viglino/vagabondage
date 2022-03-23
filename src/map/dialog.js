import map from "./map";
import Dialog from 'ol-ext/control/Dialog'
import Status from 'ol-ext/control/Status'

const dialog = new Dialog({
  target: document.body
});
map.addControl(dialog);

const status = new Status;
status.setVisible(true);
map.addControl(status);

export { status }
export default dialog