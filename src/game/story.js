const story = {
  ready: false,
  stories: {}
}

// Loader
const loader = [
  'default'
]

// Load stories
loader.forEach(s => {
  fetch('./story/' + s + '.txt')
  .then(response => response.text())
  .then(data => {
  });
})

export default story