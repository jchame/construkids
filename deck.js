/* Construkids — slide deck controller */
(function () {
  const deck = document.getElementById('deck');
  const slides = Array.from(deck.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const fill = document.getElementById('fill');
  const curEl = document.getElementById('cur');
  const totEl = document.getElementById('tot');
  const total = slides.length;
  let i = 0;

  totEl.textContent = String(total).padStart(2, '0');

  function pad(n) { return String(n + 1).padStart(2, '0'); }

  function render(prevIndex) {
    slides.forEach((s, idx) => {
      s.classList.toggle('is-active', idx === i);
      s.classList.toggle('is-prev', idx < i);
      if (idx === i) s.scrollTop = 0;
    });
    curEl.textContent = pad(i);
    fill.style.width = (((i + 1) / total) * 100) + '%';
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === total - 1;
    if (history.replaceState) history.replaceState(null, '', '#' + (i + 1));
  }

  function go(n) {
    const next = Math.max(0, Math.min(total - 1, n));
    if (next === i) return;
    const prevIndex = i;
    i = next;
    render(prevIndex);
  }
  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // keyboard
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); go(0); }
    else if (e.key === 'End') { e.preventDefault(); go(total - 1); }
  });

  // touch swipe
  let x0 = null, y0 = null;
  deck.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  deck.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); }
    x0 = y0 = null;
  }, { passive: true });

  // deep link via hash
  const start = parseInt((location.hash || '').replace('#', ''), 10);
  if (!isNaN(start) && start >= 1 && start <= total) i = start - 1;

  render(i);
})();
