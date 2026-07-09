/* Vision Touch Ltd — accessible form validation + Web3Forms submission.
   Enquiries are emailed to inquiries@visiontouchltd.co.uk via Web3Forms (no backend).
   The form also submits natively (no JS) as a fallback, straight to Web3Forms. */
(function () {
  'use strict';
  var EMAIL = 'inquiries@visiontouchltd.co.uk';

  function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function phoneOk(v) { return /^[0-9 +()\-]{7,}$/.test(v); }

  function setError(field, msg) {
    field.classList.add('field--error');
    var err = field.querySelector('.field__err');
    if (err && msg) err.textContent = msg;
  }
  function clearError(field) { field.classList.remove('field--error'); }

  function validate(form) {
    var ok = true;
    form.querySelectorAll('.field').forEach(function (field) {
      var input = field.querySelector('input, select, textarea');
      if (!input || input.type === 'checkbox') return;
      clearError(field);
      var val = (input.value || '').trim();
      if (input.required && !val) { setError(field, 'This field is required.'); ok = false; return; }
      if (val && input.type === 'email' && !emailOk(val)) { setError(field, 'Please enter a valid email address.'); ok = false; }
      if (val && input.dataset.type === 'phone' && !phoneOk(val)) { setError(field, 'Please enter a valid phone number.'); ok = false; }
    });
    var consent = form.querySelector('input[name="consent"]');
    if (consent && !consent.checked) {
      setError(consent.closest('.field') || consent.parentElement, 'Please tick the consent box to continue.');
      ok = false;
    }
    return ok;
  }

  function status(form, type, msg) {
    var box = form.querySelector('.form-status');
    if (!box) return;
    box.className = 'form-status form-status--' + (type === 'ok' ? 'ok' : 'err');
    box.innerHTML = msg;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    // live-clear errors
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('input', function () { var f = input.closest('.field'); if (f) clearError(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // honeypot: if filled, silently pretend success (likely a bot)
      var hp = form.querySelector('input[name="company_website"]');
      if (hp && hp.value) { status(form, 'ok', 'Thank you — your enquiry has been received.'); form.reset(); return; }

      if (!validate(form)) { status(form, 'err', 'Please correct the highlighted fields and try again.'); return; }

      // Web3Forms access key must be configured (see README §7)
      var keyEl = form.querySelector('input[name="access_key"]');
      var key = keyEl ? keyEl.value.trim() : '';
      if (!key || key.indexOf('YOUR_') === 0) {
        status(form, 'err', 'The online form isn’t connected yet. Please email us at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> and we’ll respond right away.');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (r) { return r.json().catch(function () { return { success: r.ok }; }); })
        .then(function (res) {
          if (res && res.success) {
            status(form, 'ok', 'Thank you — your enquiry has been sent. We’ll be in touch shortly.');
            form.reset();
          } else {
            throw new Error((res && res.message) || 'failed');
          }
        })
        .catch(function () {
          status(form, 'err', 'Sorry, we couldn’t send your enquiry just now. Please email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> or message us on WhatsApp.');
        })
        .finally(function () { if (btn) { btn.disabled = false; btn.innerHTML = label; } });
    });
  });
})();
