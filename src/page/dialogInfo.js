import ol_ext_element from "ol-ext/util/element";
import _T from "../i18n/i18n";
import dialog from "../map/dialog";
import './dialogInfo.css'

/** Show dialog info
 * @param {Array<string>} info
 * @param {string} title
 * @param {function} cback
 */
function showDialogInfo(info, options, cback) {
  options = options || {};
  const content = info.shift().replace(/</g, '&lt;').replace(/^\n/,'').replace(/\n/g, '<br/>');
  dialog.show({
    content: content,
    className: 'begin',
    buttons: [ info.length ? _T('nextBt') : _T('startBt') ],
    hideOnBack: true
  })
  dialog.set('hideOnClick', true);
  dialog.once('hide', function() {
    if (info.length) {
      setTimeout(() => showDialogInfo(info, undefined, cback));
    } else {
      dialog.set('hideOnClick', false);
      if (cback) cback();
    }
  })
};

export default showDialogInfo