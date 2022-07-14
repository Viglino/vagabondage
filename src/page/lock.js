/** @file lock screen
 */
import ol_ext_element from "ol-ext/util/element";

import './lock.css'

function showLock() {
  if (localStorage.getItem('vagabond@lock')) return;

  // Hide body elements
  document.body.dataset.lock = '';

  const lock = new ol_ext_element.create('DIV', {
    style: {
      position: 'absolute',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -40%)',
    }
  })

  // Lock div
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

  // Add 3 inputs
  const inputs = [];
  for (let i=0; i<3; i++) {
    // Container
    const d =   ol_ext_element.create('DIV', {
      parent: lock
    })
    // Input
    const input = ol_ext_element.create('INPUT', {
      type: 'text',
      on: {
        keydown: () => {
          input.value = '';
        },
        keyup: () => {
          if ('' + inputs[0].value + inputs[1].value + inputs[2].value === '192') {
            // Hide/remove lock
            lock.parentNode.remove();
            delete document.body.dataset.lock;
            // Resize
            window.dispatchEvent(new Event('resize'));
            localStorage.setItem('vagabond@lock', 1);
            return;
          }
          inputs[(i+1)%3].focus();
        }
      },
      parent: d
    });
    inputs.push(input);
    // Underscore
    ol_ext_element.create('DIV', {
      parent: d
    })
  }

  // Focus on first input
  setTimeout(() => inputs[0].focus(), 100)
}

showLock();
