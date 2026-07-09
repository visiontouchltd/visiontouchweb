/* Vision Touch Ltd — reviews carousel: auto-advancing, swipeable, with dot indicators. */
(function () {
  'use strict';
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.reviews-track');
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = root.querySelector('[data-dots]');
    if (!slides.length) return;
    var index = 0, timer = null;

    function perView() {
      if (window.matchMedia('(max-width: 560px)').matches) return 1;
      if (window.matchMedia('(max-width: 820px)').matches) return 2;
      return 3;
    }
    function steps() { return Math.max(1, slides.length - perView() + 1); }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (var i = 0; i < steps(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'carousel-dot';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Go to review ' + (i + 1));
        (function (i) { b.addEventListener('click', function () { go(i); restart(); }); })(i);
        dotsWrap.appendChild(b);
      }
    }

    function render() {
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var w = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = 'translateX(' + (-index * w) + 'px)';
      if (dotsWrap) {
        var dots = dotsWrap.children;
        for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('active', i === index);
      }
    }
    function go(i) {
      var max = steps() - 1;
      index = i > max ? 0 : (i < 0 ? max : i);
      render();
    }
    function next() { go(index + 1); }
    function start() { timer = setInterval(next, 5000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    // swipe
    var startX = 0;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
      start();
    });

    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { buildDots(); if (index > steps() - 1) index = 0; render(); }, 150);
    });

    buildDots();
    go(0);
    start();
  });
})();
