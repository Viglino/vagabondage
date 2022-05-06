const data = {
  ready: false,
  stories: {}
}
const stories = data.stories;

// Loader
const loader = [
  'default',
  'amnesie',
  'pandemic',
  'cours',
  'fugitif',
  'fugitifs'
]

// Load stories
loader.forEach(s => {
  fetch('./story/' + s + '.txt')
  .then(response => response.text())
  .then(st => {
    st = st.replace(/\r/g, '').split('\n');
    const story = {};
    stories[s] = story;
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
    data.length = Object.keys(stories).length;
    data.ready = (data.length === loader.length);
  });
})

/** Get a random story */
function getRandomStory() {
  const keys = Object.keys(stories);
  const k = keys[Math.floor(Math.random() * keys.length)] || 'default';
  console.log(k)
  return stories[k];
}

export { getRandomStory }

export default data