const dateEl = document.getElementById('currentDate');

const updateClock = () => {
  const now = new Date();
  dateEl.textContent = now.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const applyImageFallbacks = () => {
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    const container = img.closest('figure');
    const fallbackName = img.dataset.fallback;

    const enableFallback = () => {
      img.classList.add('asset-missing');
      if (container) {
        container.classList.add('has-fallback');
        container.dataset.fallback = fallbackName;
      }
    };

    const disableFallback = () => {
      img.classList.remove('asset-missing');
      if (container) {
        container.classList.remove('has-fallback');
        delete container.dataset.fallback;
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      disableFallback();
      return;
    }

    if (img.complete && img.naturalWidth === 0) {
      enableFallback();
      return;
    }

    img.addEventListener('load', disableFallback, { once: true });
    img.addEventListener('error', enableFallback, { once: true });
  });
};

updateClock();
applyImageFallbacks();
setInterval(updateClock, 1000);
