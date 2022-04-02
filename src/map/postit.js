import element from 'ol-ext/util/element'

import './postit.css'

// Post it
const postitElt = element.create('DIV', {
  className: 'postit',
  parent: document.body
})
const postit = element.create('DIV', {
  parent: postitElt
})

export default postit