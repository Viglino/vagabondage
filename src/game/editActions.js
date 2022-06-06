import Dialog from 'ol-ext/control/Dialog'
import ol_ext_element from 'ol-ext/util/element';
import map from '../map/map';
import { saveAs } from 'file-saver';

import actionsPlaces from './actionsPlaces'
import './editActions.css'

/*
const placeType = {};
Object.keys(actionsPlaces).forEach(k => {
  actionsPlaces[k].actions.forEach(p => {
    p.forEach(a => {
      placeType[a.type] = 1;
    })
  })
})
console.log('placeType', Object.keys(placeType).join(','));
*/

const dlog = new Dialog({
  className: 'editActions',
  closeOnSubmit: false,
  target: document.body
});

function addLine(div, action, label, attr, onChange) {
  ol_ext_element.create('LABEL', { 
    html: label, 
    className: attr,
    parent: div
  });
  let input;
  switch (attr) {
    case 'type': {
      input = ol_ext_element.create('SELECT', {
        className: attr,
        parent: div
      });
      ['none','info','drink','water','water,drink','food','rest','object','danger'].forEach(o => {
        ol_ext_element.create('OPTION', {
          value: o,
          html: o,
          parent: input
        });
      });
      input.addEventListener('change', () => {
        div.parentNode.dataset.type = input.value;
      })
      div.parentNode.dataset.type = action[attr];
      break;
    }
    case 'object': {
      input = ol_ext_element.create('SELECT', {
        className: attr,
        parent: div
      });
      ['bottle','shoes','key'].forEach(o => {
        ol_ext_element.create('OPTION', {
          value: o,
          html: o,
          parent: input
        });
      });
      break;
    }
    default: {
      input = ol_ext_element.create('INPUT', {
        type: 'text',
        className: attr,
        placeholder: label ? '' : attr,
        parent: div
      })
      break;
    }
  }
  input.value = action[attr] || '';
  input.addEventListener('change', () => {
    if (onChange) onChange(input.value);
    else action[attr] = input.value;
  });
}

/* Edit action place */
function editAction(a, div) {
  const place = actionsPlaces[a];
  console.log(place)
  div.innerHTML = '';
  addLine(div, place, 'Title : ', 'title');
  addLine(div, place, 'Info : ', 'info');
  addLine(div, place, 'Search : ', 'search', (value) => {
    if (value) {
      value = value.replace(/^\//,'').split('/');
      place.search = new RegExp(value[0], value[1]);
    } else {
      delete place.search;
    }
  });
  ol_ext_element.create('LABEL', { html: 'Actions list : ', parent: div })
  const ul = ol_ext_element.create('UL', { parent: div })
  place.actions.forEach(actions => {
    const li = ol_ext_element.create('LI', { parent: ul })
    const ul2 = ol_ext_element.create('UL', { parent: li })
    actions.forEach(a => {
      const li = ol_ext_element.create('LI', { parent: ul2 })
      const ul3 = ol_ext_element.create('UL', { parent: li })
      const li2 = ol_ext_element.create('LI', { parent: ul3 })
      addLine(li2, a, '', 'type', (value) => {
        a.type = value.split(',');
        if (a.type.length < 2) a.type = a.type[0] || '';
      });
      addLine(li2, a, 'Object : ', 'object');
      addLine(li2, a, 'Title : ', 'title', (value) => {
        if (value) a.title = value;
        else delete a.title;
      });
      addLine(li2, a, 'Description : ', 'desc');
      addLine(li2, a, 'Action : ', 'action');
    })
    ol_ext_element.create('BUTTON', {
      html: 'OR',
      click: () => {
        actions.push({ type:'', desc: '', action: '' });
        editAction(a, div);
      },
      parent: ol_ext_element.create('LI', { className: 'button', parent: ul2 })
    })
  })
  ol_ext_element.create('BUTTON', {
    html: 'AND',
    click: () => {
      place.actions.push([{ type:'', desc: '', action: '' }]);
      editAction(a, div);
    },
    parent: ol_ext_element.create('LI', { className: 'button', parent: ul })
  })
}

/* Dialog */
window.editActions = function() {
  if (!dlog.getMap()) map.addControl(dlog);
  dlog.show({
    title: 'Edit actions',
    buttons: { add: 'add new place', save: 'save', cancel: 'cancel' },
    onButton: (b) => {
      switch (b) {
        case 'add': {
          const k = prompt('New place');
          const select = dlog.getContentElement().querySelector('select');
          if (k) {
            if (!actionsPlaces[k]) {
              actionsPlaces[k] = {
                title: '',
                actions: []
              }
              ol_ext_element.create('OPTION', {
                value: k,
                html: k,
                parent: select
              })
            }
            select.value = k;
            editAction(k, div);
          }
          dlog.show();
          break;
        }
        case 'save': {
          // format
          for (let k in actionsPlaces) {
            actionsPlaces[k].actions.forEach(actions => {
              actions.forEach(a => {
                switch (a.type) {
                  case 'none': {
                    delete a.action;
                    delete a.object;
                    delete a.title;
                    break;
                  }
                  case 'object': {
                    break;
                  }
                  default: {
                    delete a.object;
                    break;
                  }
                }
              })
            })
          }
          // Stringify regex
          Object.defineProperty(RegExp.prototype, "toJSON", {
            value: RegExp.prototype.toString
          });
          // save
          let js = 'export default ' + JSON.stringify(actionsPlaces, null, '  ');
          js = js.replace(/"search": "(.*)",\n/,'"search": $1,\n');
          var blob = new Blob([js], {type: 'text/plain;charset=utf-8'});
          saveAs(blob, "actionsPlaces.js");
          break;
        }
      }
    }
  })
  const content = dlog.getContentElement();
  content.innerHTML = '';
  const select = ol_ext_element.create('SELECT', { 
    change: () => editAction(select.value, div),
    parent: content
  })
  ol_ext_element.create('OPTION', {
    value: '',
    html: 'places',
    style: { display: 'none' },
    parent: select
  })
  Object.keys(actionsPlaces).forEach(k => {
    ol_ext_element.create('OPTION', {
      value: k,
      html: k,
      parent: select
    })
  });
  const div = ol_ext_element.create('DIV', { 
    html: '<i>Select a place...</i>',
    parent: content
  });
}