/** Internationalization
 * @author Jean-Marc VIGLINO (https://github.com/Viglino)
 */
let navLang = (navigator.language || navigator.userLanguage).split('-').shift();

// Global i18n
const i18n = {
  fr: {}
};

/** Load languages
 * @param {object} values
 * @param {string} lang
 */
function addLang(values, lang) {
  if (!lang) lang = navLang;
  if(!i18n[lang]) i18n[lang] = {};
  Object.keys(values).forEach(k => {
    i18n[lang][k] = values[k]
  })
}

/** Set default languages
 * @param {string} lang
 */
function setLang(lang) {
  navLang = lang;
}

// Global function
const _T = function(k) {
  return (i18n[navLang] || i18n.fr)[k] || i18n.fr[k] || k;
};

export { setLang, addLang }
export default _T
