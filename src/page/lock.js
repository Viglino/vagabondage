import ol_ext_element from "ol-ext/util/element";

import './lock.css'

document.body.dataset.lock = '';

const lock = new ol_ext_element.create('DIV', {
  style: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -40%)',
  }
})

new ol_ext_element.create('DIV', {
  id: 'lock',
  html: lock,
  click: () => {
    inputs[0].focus();
  },
  style: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right:0,
    background: '#fff',
    zIndex: 999999,
  },
  parent: document.body
})

const inputs = [];
for (let i=0; i<3; i++) {
  const d =   ol_ext_element.create('DIV', {
    parent: lock
  })
  const input = ol_ext_element.create('INPUT', {
    type: 'text',
    on: {
      keydown: () => {
        input.value = '';
      },
      keyup: () => {
        if ('' + inputs[0].value + inputs[1].value + inputs[2].value === '192') {
          lock.parentNode.remove();
          delete document.body.dataset.lock;
          window.dispatchEvent(new Event('resize'));
          return;
        }
        inputs[(i+1)%3].focus();
      }
    },
    parent: d
  });
  inputs.push(input);
  ol_ext_element.create('DIV', {
    parent: d
  })
}

setTimeout(() => inputs[0].focus(), 100)