/* Vision Touch Ltd — subtle hammer cursor accent.
   Set ENABLE_HAMMER = false below to disable site-wide.
   Auto-disabled on touch devices and when reduced-motion is requested. */
(function () {
  'use strict';
  var ENABLE_HAMMER = true;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (!ENABLE_HAMMER || reduce || touch) return;

  var el = document.createElement('div');
  el.className = 'hammer-cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M14.5 2.5l7 7-2.5 2.5-2.2-2.2-7.6 7.6a2 2 0 0 1-2.8 0l-.6-.6a2 2 0 0 1 0-2.8l7.6-7.6L9 4.9 11.5 2.5z" ' +
    'fill="#F7931E" stroke="#E2620E" stroke-width="1" stroke-linejoin="round"/>' +
    '<rect x="2.2" y="18.2" width="8" height="2.4" rx="1.2" transform="rotate(-45 2.2 18.2)" fill="#2A251E"/>' +
    '</svg>';
  document.body.appendChild(el);

  var x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y, active = false, raf;

  function loop() {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    el.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%) rotate(-12deg)';
    raf = requestAnimationFrame(loop);
  }
  window.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
    if (!active) { active = true; el.classList.add('is-active'); }
  }, { passive: true });
  window.addEventListener('mousedown', function () { el.classList.add('is-down'); });
  window.addEventListener('mouseup', function () { el.classList.remove('is-down'); });
  document.addEventListener('mouseleave', function () { el.classList.remove('is-active'); active = false; });
  loop();
})();
