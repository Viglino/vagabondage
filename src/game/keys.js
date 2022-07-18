import dialog from '../map/dialog'
import { bagDialog } from '../map/dialog'
import routing from '../map/routing'

window.addEventListener('keydown', e => {
  // Handle ESC key
  if (e.key === 'Escape') {
    if (routing.handlingDownUpSequence) {
      // Stop routing
      routing.stopDragging();
    } else if (document.body.dataset.mode === 'carte') {
      // Close map
      document.querySelector('.ol-button.carte button').click();
    } else if (bagDialog.isOpen()) {
      // Close bag
      if (!bagDialog.element.classList.contains('drop')) {
        bagDialog.close();
      }
    } else if (dialog.isOpen())  {
      // Close actions and place dialog
      if (/actions|place/.test(dialog.element.className)) {
        dialog.element.querySelector('.ol-buttons input').click();
      }
    } else {
      // Open search around
      document.querySelector('.ol-button.actions button').click();
    }
  }
})