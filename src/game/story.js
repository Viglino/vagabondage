import DropFile from 'ol-ext/interaction/DropFile'
import dialog from "../map/dialog";
import map from "../map/map";

const data = {
  ready: false,
  stories: {}
}
const stories = data.stories;

// Loader
const loader = [
  'default',
  'amnesie',
  'brothers',
  'cours',
  'fugitif',
  'fugitifs',
  'pandemic',
  'trousses'
]

// Load stories
loader.forEach(s => {
  fetch('./story/' + s + '.txt')
  .then(response => response.text())
  .then(st => {
    stories[s] = decode(st);
    data.length = Object.keys(stories).length;
    data.ready = (data.length === loader.length);
    if (data.ready) {
      // Get story from url
      dropStory = stories[location.search.replace(/^\?/,'')];
    }
  });
})

/** Decode story */
function decode(st) {
  st = st.replace(/\r/g, '').split('\n');
  const story = {};
  let key;
  st.forEach(l => {
    if (l.charAt(0) === '#') {
      l = l.split(':');
      key = l.shift().replace(/^#/,'').trim();
      const val = l.join(':');
      if (l.length) {
        if (story[key]) {
          if (!(story[key] instanceof Array)) story[key] = [story[key]];
          story[key].push(val.trim());
        } else {
          story[key] = val.trim();
        }
      }
    } else if (key) {
      if (story[key] instanceof Array) {
        const n = story[key].length -1
        story[key][n] += (story[key][n] ? '\n' : '') + l;
      } else {
        story[key] += (story[key] ? '\n' : '') + l;
      }
    }
  })
  return story;
}

/** Get a random story */
function getRandomStory() {
  dropFile.setActive(false);
  if (dropStory) {
    return dropStory;
  }
  const keys = Object.keys(stories);
  const k = keys[Math.floor(Math.random() * keys.length)] || 'default';
  console.log(k)
  return stories[k];
}

// Story dropped
let dropStory;

const dropFile = new DropFile({
  formatConstructors: [],
  accept: ['.txt']
})
map.addInteraction(dropFile)

// A story file is dropped
dropFile.on('loadstart', (e) => {
  if (dropFile.getActive() && e.isok) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const result = e.target.result;
      if (result) {
        dropStory = decode(result)
        dialog.hide();
      }
    };
    // Start loading
    reader.readAsText(e.file);
  }
})


export { getRandomStory }

export default data