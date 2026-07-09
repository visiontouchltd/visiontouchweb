/* Vision Touch Ltd — main interactions (vanilla, lightweight) */
(function () {
  'use strict';
  var doc = document;

  /* ---- Header: shrink on scroll ---- */
  var header = doc.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 30); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile nav ---- */
  var burger = doc.querySelector('.burger');
  var nav = doc.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = doc.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close on link click
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { doc.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded', 'false'); });
    });
    // mobile submenu toggle
    nav.querySelectorAll('.has-sub > button').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (window.matchMedia('(max-width: 900px)').matches) {
          e.preventDefault();
          btn.parentElement.classList.toggle('open');
        }
      });
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') { doc.body.classList.remove('nav-open'); } });
  }

  /* ---- Scroll reveal ---- */
  var reveals = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Animated counters ---- */
  var counters = doc.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '', dur = 1400, start = null;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
          el.textContent = (Math.round(target * ease)).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Before / After sliders ---- */
  doc.querySelectorAll('.ba').forEach(function (ba) {
    var after = ba.querySelector('.ba__after');
    var divider = ba.querySelector('.ba__divider');
    var handle = ba.querySelector('.ba__handle');
    var dragging = false;
    var set = function (clientX) {
      var r = ba.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      var p = pct * 100;
      after.style.clipPath = 'inset(0 0 0 ' + p + '%)';
      divider.style.left = p + '%';
      handle.style.left = p + '%';
    };
    var down = function (e) { dragging = true; set((e.touches ? e.touches[0] : e).clientX); };
    var move = function (e) { if (dragging) set((e.touches ? e.touches[0] : e).clientX); };
    var up = function () { dragging = false; };
    ba.addEventListener('mousedown', down); ba.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('mousemove', move); window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', up); window.addEventListener('touchend', up);
    // hover-to-reveal on desktop
    ba.addEventListener('mousemove', function (e) { if (!dragging) set(e.clientX); });
  });

  /* ---- Current year ---- */
  doc.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Portfolio filter ---- */
  var chips = doc.querySelectorAll('[data-filter]');
  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var f = chip.dataset.filter;
        doc.querySelectorAll('[data-cat]').forEach(function (item) {
          var show = f === 'all' || item.dataset.cat === f;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---- Project image lightbox ---- */
  var triggers = doc.querySelectorAll('[data-full]');
  if (triggers.length) {
    var lb = doc.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<div class="lightbox__backdrop" data-close></div>' +
      '<figure class="lightbox__inner"><button class="lightbox__close" data-close aria-label="Close">&times;</button>' +
      '<img class="lightbox__img" alt=""><figcaption class="lightbox__cap"></figcaption></figure>';
    doc.body.appendChild(lb);
    var lbImg = lb.querySelector('.lightbox__img');
    var lbCap = lb.querySelector('.lightbox__cap');
    var openBtn = null;
    var openLb = function (t) {
      openBtn = t;
      lbImg.src = t.dataset.full; lbImg.alt = t.dataset.title || '';
      lbCap.innerHTML = '<strong>' + (t.dataset.title || '') + '</strong>' + (t.dataset.caption ? '<span>' + t.dataset.caption + '</span>' : '');
      lb.classList.add('open'); doc.body.style.overflow = 'hidden';
      lb.querySelector('.lightbox__close').focus();
    };
    var closeLb = function () {
      lb.classList.remove('open'); doc.body.style.overflow = '';
      if (openBtn) { openBtn.focus(); openBtn = null; }
      setTimeout(function () { lbImg.src = ''; }, 250);
    };
    triggers.forEach(function (t) { t.addEventListener('click', function (e) { e.preventDefault(); openLb(t); }); });
    lb.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeLb(); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
  }
})();
