import map from "./map";
import Dialog from 'ol-ext/control/Dialog'

const dialog = new Dialog({
  target: document.body
});

map.addControl(dialog);

export default dialog