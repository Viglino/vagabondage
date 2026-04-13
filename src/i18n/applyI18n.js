import _T from './i18n';

/** Apply i18n translations to a DOM element.
 * Processes:
 *  data-i18n="key"       → node.textContent = _T(key)
 *  data-i18n-html="key"  → node.innerHTML   = _T(key)
 *  data-i18n-title="key" → node.title        = _T(key)
 * @param {Element} el root element to scan
 */
export default function applyI18n(el) {
  if (!el) return;
  el.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = _T(node.dataset.i18n);
  });
  el.querySelectorAll('[data-i18n-html]').forEach(node => {
    node.innerHTML = _T(node.dataset.i18nHtml);
  });
  el.querySelectorAll('[data-i18n-title]').forEach(node => {
    node.title = _T(node.dataset.i18nTitle);
  });
}
