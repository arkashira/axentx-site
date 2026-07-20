(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Scroll-reveal below the fold, driven entirely by inline styles so no stylesheet
  // cascade can leave content stuck hidden. If this script never runs, nothing is
  // hidden. A safety timer reveals everything after 4s no matter what.
  const sel = [
    '.sec .kicker', '.sec h2', '.sec .lead', '.sec .cols>*', '.sec .line',
    '.why .kicker', '.why h2', '.why .cols>*', '.why .line',
    '.build .kicker', '.build h2', '.build .cell',
    '.pdetail .prow', '.slist .srow', '.clist .crow', '.diagram',
    '.close .kicker', '.close h2', '.close p', '.close .act'
  ].join(',');
  const els = [...document.querySelectorAll(sel)];
  const vh = window.innerHeight || document.documentElement.clientHeight || 800;
  els.forEach(el => {
    if (el.getBoundingClientRect().top < vh * 0.92) { el.dataset.shown = '1'; return; }
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
  });

  // stagger siblings inside a group so cards reveal one after another
  ['.grid', '.slist', '.clist', '.cols'].forEach(g =>
    document.querySelectorAll(g).forEach(group => {
      let k = 0;
      [...group.children].forEach(c => { if (els.includes(c)) { c.dataset.d = k * 70; k++; } });
    }));

  const show = el => {
    if (el.dataset.shown) return;
    el.dataset.shown = '1';
    const d = +(el.dataset.d || 0);
    el.style.transition = `opacity .6s ease ${d}ms, transform .6s ease ${d}ms`;
    el.style.opacity = '1';
    el.style.transform = 'none';
  };

  let ticking = false;
  const reveal = () => {
    ticking = false;
    const h = window.innerHeight || document.documentElement.clientHeight;
    for (const el of els) {
      if (el.dataset.shown) continue;
      const r = el.getBoundingClientRect();
      if (r.top < h * 0.92 && r.bottom > 0) show(el);
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(reveal); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('scroll', onScroll, { passive: true, capture: true });
  reveal();
  setTimeout(() => els.forEach(show), 4000);

  // Hero console: stream the log lines in one after another, like a live agent.
  const body = document.querySelector('.console .body');
  if (body) {
    const lines = [...body.children];
    lines.forEach(l => { l.style.opacity = '0'; });
    let i = 0;
    const step = () => {
      if (i < lines.length) {
        lines[i].style.transition = 'opacity .3s ease';
        lines[i].style.opacity = '1';
        i++;
        setTimeout(step, 650);
      }
    };
    setTimeout(step, 950);
  }
})();
