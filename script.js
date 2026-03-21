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

const setupImageLightbox = () => {
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const expandableImages = document.querySelectorAll('img[data-expandable="true"]');

  if (!lightbox || !lightboxImage || !expandableImages.length) {
    return;
  }

  let activeTrigger = null;

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = '';
    document.body.classList.remove('lightbox-open');

    if (activeTrigger) {
      activeTrigger.focus();
      activeTrigger = null;
    }
  };

  const openLightbox = (img) => {
    activeTrigger = img;
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt;
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  };

  expandableImages.forEach((img) => {
    img.addEventListener('click', () => openLightbox(img));
    img.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(img);
      }
    });
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.lightboxClose === 'true') {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) {
      closeLightbox();
    }
  });
};

const setupDiamondBreakdownEditor = () => {
  const table = document.getElementById('diamondBreakdownTable');
  const editButton = document.getElementById('tableEditBtn');
  const status = document.getElementById('tableEditStatus');
  const tableWrap = table?.closest('.table-wrap');

  if (!table || !editButton || !status || !tableWrap) {
    return;
  }

  const editableCells = table.querySelectorAll('tbody td, tfoot td');
  let isEditing = false;

  const updateEditState = () => {
    editableCells.forEach((cell) => {
      cell.contentEditable = isEditing ? 'true' : 'false';
      cell.spellcheck = false;
      if (isEditing) {
        cell.setAttribute('tabindex', '0');
      } else {
        cell.removeAttribute('tabindex');
      }
    });

    tableWrap.classList.toggle('is-editing', isEditing);
    editButton.classList.toggle('is-editing', isEditing);
    editButton.setAttribute('aria-pressed', String(isEditing));
    editButton.textContent = isEditing ? 'Finish Editing' : 'Edit Breakdown';
    status.textContent = isEditing ? 'Editing enabled — click any value to update it' : 'Read-only mode';
  };

  editButton.addEventListener('click', () => {
    isEditing = !isEditing;
    updateEditState();

    if (isEditing) {
      editableCells[0]?.focus();
    }
  });

  editableCells.forEach((cell) => {
    cell.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        cell.blur();
      }
    });
  });

  updateEditState();
};

const setupPrintJobBagButton = () => {
  const printButton = document.getElementById('printJobBagBtn');

  if (!printButton) {
    return;
  }

  printButton.addEventListener('click', () => {
    window.print();
  });
};

updateClock();
applyImageFallbacks();
setupImageLightbox();
setupDiamondBreakdownEditor();
setupPrintJobBagButton();
setInterval(updateClock, 1000);
