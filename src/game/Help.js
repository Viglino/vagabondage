import olObject from 'ol/Object'
import ol_ext_element from 'ol-ext/util/element'

import './Help.css'

/** Create help page with steps: [data-step] element attributes
 * @param {Object} options
 *  @param {string} options.className
 *  @param {Element|string} options.content
 *  @param {function} options.onFinish
 * @fires start
 * @fires end
 * @fires step
 */
class Help extends olObject{
  constructor(options) {
    super(options);
    this._className = options.className || '';
    this._onFinish = options.onFinish;
    this.element = ol_ext_element.create('DIV', {
      'data-role': 'helpPage',
      className: options.className,
      html: options.content,
      click: () => this.nextStep(),
      parent: document.body
    })
  }
}

/** Reset help (show it next time)
 */
Help.prototype.reset = function() {
  localStorage.removeItem('help@help-' + this._className);
}

/** Mark as done
 */
Help.prototype.done = function() {
  localStorage.setItem('help@help-' + this._className, 1);
}

/** Is help done
 * @returns {boolean}
 */
Help.prototype.isDone = function() {
  return !!localStorage.getItem('help@help-' + this._className)
}

/** Show help
 * @param {function} [onFinish] do something when done
 * @param {boolean} [keepIt=false] if false prevent showing help next time
 */
Help.prototype.show = function(onFinish, keepIt) {
  if (!this.isDone()) {
    if (onFinish) this._onFinish = onFinish;
    this.element.classList.add('visible');
    this.showStep(1);
    if (!keepIt) this.done();
    this.dispatchEvent({ type: 'start' })
  } else {
    if (onFinish) onFinish();
  }
}

/** Show step
 * @param {string|number} i
 */
Help.prototype.showStep = function(i) {
  this.element.dataset.step = i;
  this.element.querySelectorAll('[data-step]').forEach(step => {
    step.style.display = (step.dataset.step == i ? 'block': 'none');
  })
  this.dispatchEvent({ type: 'step', step: i })
}

/** Show next step
 */
Help.prototype.nextStep = function() {
  // Current step
  const step = parseInt(this.element.dataset.step);
  if (this.element.querySelector('[data-step="'+(step+1)+'"]')) {
    // Has a next step
    this.showStep(step+1);
  } else {
    // Finish help
    this.element.classList.remove('visible');
    if (this._onFinish) this._onFinish();
    this.dispatchEvent({ type: 'end' })
  }
}

/** Hide help */
Help.prototype.hide = function() {
  this.element.classList.remove('visible');
}

export default Help