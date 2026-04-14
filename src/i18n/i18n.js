/** Internationalization
 * @author Jean-Marc VIGLINO (https://github.com/Viglino)
 */
let navLang = localStorage.getItem('vagabondage@lang')
  || (navigator.language || navigator.userLanguage).split('-').shift()
  || 'en';

// Global i18n
const i18n = {
  fr: {},
  en: {}
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

/** Set default language and persist choice
 * @param {string} lang
 */
function setLang(lang) {
  navLang = lang;
  localStorage.setItem('vagabondage@lang', lang);
}

/** Get current language
 * @returns {string}
 */
function getLang() {
  return navLang;
}

// Global function
const _T = function(k) {
  return (i18n[navLang] || i18n.en)[k] || i18n.en[k] || i18n.fr[k] || k;
};

export { setLang, getLang, addLang }
export default _T
