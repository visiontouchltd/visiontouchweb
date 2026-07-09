/* Vision Touch Ltd — "See us at work" coverflow carousel.
   Center card largest; side cards recede & clip outward. Auto-advances on a fixed
   interval, pauses on hover, with arrows, dots, swipe and keyboard control. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INTERVAL = 5000;

  document.querySelectorAll('[data-coverflow]').forEach(function (cf) {
    var cards = Array.prototype.slice.call(cf.querySelectorAll('.cf__card'));
    var dots = Array.prototype.slice.call(cf.querySelectorAll('.cf__dot'));
    if (!cards.length) return;
    var active = 0, timer = null;

    function layout() {
      cards.forEach(function (card, i) {
        var off = i - active;
        var abs = Math.abs(off);
        var tx = off * 56;                          // % of card width
        var scale = Math.max(0.6, 1 - abs * 0.15);
        var op = abs === 0 ? 1 : abs === 1 ? 0.92 : abs === 2 ? 0.62 : abs === 3 ? 0.3 : 0;
        card.style.transform = 'translate(-50%,-50%) translateX(' + tx + '%) scale(' + scale + ')';
        card.style.opacity = op;
        card.style.zIndex = String(100 - abs);
        card.style.pointerEvents = abs > 0 && abs <= 3 ? 'auto' : 'none';
        card.classList.toggle('is-active', abs === 0);
        card.setAttribute('aria-hidden', abs === 0 ? 'false' : 'true');
      });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === active); });
    }
    function go(i) { active = (i % cards.length + cards.length) % cards.length; layout(); }
    function next() { go(active + 1); }
    function prev() { go(active - 1); }
    function start() { if (reduce) return; stop(); timer = setInterval(next, INTERVAL); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    // click a side card to bring it to centre
    cards.forEach(function (card, i) { card.addEventListener('click', function () { if (i !== active) { go(i); start(); } }); });
    var p = cf.querySelector('[data-cf-prev]'), n = cf.querySelector('[data-cf-next]');
    if (p) p.addEventListener('click', function () { prev(); start(); });
    if (n) n.addEventListener('click', function () { next(); start(); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); start(); }); });

    cf.addEventListener('pointerenter', stop);
    cf.addEventListener('pointerleave', start);

    var sx = 0;
    cf.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; stop(); }, { passive: true });
    cf.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
      start();
    });
    cf.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); start(); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { prev(); start(); e.preventDefault(); }
    });

    layout();
    start();
  });
})();
