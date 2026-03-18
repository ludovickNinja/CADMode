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

updateClock();
setInterval(updateClock, 1000);
