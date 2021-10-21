import Keys from '@/lib/keys';
import useEvent from '@/hooks/event';

/**
 * Disable pointer events when the user uses the keynoard
 * Enables them again after the mouse moves
 */
function usePointerEvents() {
  function eventListener(event: KeyboardEvent) {
    if (!Object.values(Keys.Navigation).includes(event.key)) {
      return;
    }

    disablePointerEvents();
  }

  useEvent('keydown', eventListener);
}

function disablePointerEvents() {
  if (document.body.style.pointerEvents === 'none') {
    return;
  }

  document.body.style.pointerEvents = 'none';

  window.addEventListener('mousemove', activatePointerEvents);
  window.addEventListener('touchstart', activatePointerEvents);
}

function activatePointerEvents() {
  if (document.body.style.pointerEvents === '') {
    return;
  }

  document.body.style.pointerEvents = '';

  window.removeEventListener('mousemove', activatePointerEvents);
  window.removeEventListener('touchstart', activatePointerEvents);
}

export default usePointerEvents;
