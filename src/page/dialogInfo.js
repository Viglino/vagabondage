import _T from "../i18n/i18n";
import dialog from "../map/dialog";
import './dialogInfo.css'

/** Show dialog info
 * @param {Array<string>} info
 * @param {string} title
 * @param {function} cback
 */
function showDialogInfo(info, title, cback) {
  const content = info.shift().replace(/^<br\/>/,'');
  dialog.show({
    content: content,
    title: title,
    className: 'begin',
    buttons: [ info.length ? _T('nextBt') : _T('startBt') ],
    hideOnBack: true
  })
  dialog.set('hideOnClick', true);
  dialog.once('hide', function() {
    if (info.length) {
      showDialogInfo(info, undefined, cback);
    } else {
      dialog.setContent('hideOnClick', true);
      if (cback) cback();
    }
  })
};

export default showDialogInfo