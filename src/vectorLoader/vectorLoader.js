import olObject from 'ol/Object'

import mapLoader from './mapLoader';
import { sources, layers } from './vectorData';

const vectorLoader = new olObject();

vectorLoader.map = mapLoader;

// Handle load
let toload = 0;
let maxload = 0;
Object.keys(sources).forEach(k => {
  sources[k].on('tileloadstart', () => {
    toload++;
    maxload++;
    vectorLoader.dispatchEvent({ type: 'loading', nb: maxload - toload, max: maxload });
  });
})
Object.keys(sources).forEach(k => {
  sources[k].on(['tileloadend', 'tileloaderror'], () => {
    toload--;
    vectorLoader.dispatchEvent({ type: 'loading', nb: maxload - toload, max: maxload });
    if (toload===0) {
      vectorLoader.dispatchEvent('ready');
      maxload = 0;
    }
  })
})
/** Is ready to  */
function checkReady() {
  setTimeout(() => {
    if (toload===0) vectorLoader.dispatchEvent('ready');
  })
}

vectorLoader.source = sources;
vectorLoader.layer = layers;

/** Center data on xy
 */
vectorLoader.setCenter = function(xy) {
  mapLoader.getView().setCenter(xy);
  checkReady();
};

/** Activate data
 */
vectorLoader.setActive = function(what) {
  for (let i in layers) {
    layers[i].setVisible(what.indexOf(i) >= 0);
  }
  checkReady();
};

export default vectorLoader
