// Collapsible / dismissible league notices.
// Dismissed notices are remembered per browser via localStorage (keyed by data-notice-id).
(function () {
  const STORAGE_PREFIX = 'gdl-notice-dismissed:';

  document.querySelectorAll('.league-notice[data-notice-id]').forEach((notice) => {
    const key = STORAGE_PREFIX + notice.dataset.noticeId;

    try {
      if (localStorage.getItem(key) === '1') {
        notice.remove();
        return;
      }
    } catch (e) { /* storage unavailable - just show the notice */ }

    const dismiss = notice.querySelector('.notice-dismiss');
    if (dismiss) {
      dismiss.addEventListener('click', () => {
        try { localStorage.setItem(key, '1'); } catch (e) { /* ignore */ }
        notice.classList.add('is-dismissing');
        setTimeout(() => notice.remove(), 250);
      });
    }
  });
})();
