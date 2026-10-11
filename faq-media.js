/* Privacy FAQ carousel: native scroll-snap (touch swipe, trackpad, keyboard) plus buttons and dots.
   Without JavaScript the slides still scroll sideways and every slide has alt text. */
(function () {
  'use strict';
  var root = document.querySelector('[data-faqx-carousel]');
  if (!root) return;
  var track = root.querySelector('.faqx-track');
  var slides = [].slice.call(track.children);
  var ctl = root.querySelector('.faqx-ctl');
  var prev = root.querySelector('[data-faqx-prev]');
  var next = root.querySelector('[data-faqx-next]');
  var dotsBox = root.querySelector('.faqx-dots');
  var count = root.querySelector('.faqx-count');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var n = slides.length, cur = 0, raf = 0;

  var dots = slides.map(function (_, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Go to slide ' + (i + 1) + ' of ' + n);
    b.addEventListener('click', function () { go(i); });
    dotsBox.appendChild(b);
    return b;
  });

  function width() { return track.clientWidth || 1; }
  function go(i) {
    i = Math.max(0, Math.min(n - 1, i));
    track.scrollTo({ left: i * width(), behavior: reduce ? 'auto' : 'smooth' });
    show(i);
  }
  function show(i) {
    cur = i;
    dots.forEach(function (d, k) { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    prev.disabled = i === 0;
    next.disabled = i === n - 1;
    count.textContent = 'Slide ' + (i + 1) + ' of ' + n;
  }
  function onScroll() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      var i = Math.round(track.scrollLeft / width());
      if (i !== cur) show(Math.max(0, Math.min(n - 1, i)));
    });
  }

  prev.addEventListener('click', function () { go(cur - 1); });
  next.addEventListener('click', function () { go(cur + 1); });
  track.addEventListener('scroll', onScroll, { passive: true });
  track.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    else if (k === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(n - 1); }
  });
  window.addEventListener('resize', function () { track.scrollTo({ left: cur * width(), behavior: 'auto' }); });

  ctl.hidden = false;
  count.hidden = false;
  show(0);
})();
