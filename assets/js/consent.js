(function () {
  var KEY = 'taxocard_cookie_consent';
  var bar;

  function accept() {
    try {
      localStorage.setItem(KEY, '1');
    } catch (e) {}
    if (bar) {
      bar.classList.remove('is-visible');
      bar.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('cookie-consent-visible');
  }

  function buildBar() {
    if (document.getElementById('cookie-consent')) return;
    bar = document.createElement('div');
    bar.id = 'cookie-consent';
    bar.className = 'cookie-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-live', 'polite');
    bar.setAttribute('aria-label', 'Уведомление о cookie');
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML =
      '<div class="cookie-consent__inner container">' +
      '<p class="cookie-consent__text">Сайт использует cookie и аналитику. Подробнее — в ' +
      '<a href="politika-konfidencialnosti.html">политике конфиденциальности</a>.</p>' +
      '<button type="button" class="btn btn--accent btn--sm cookie-consent__btn">Понятно</button>' +
      '</div>';
    document.body.appendChild(bar);
    bar.querySelector('.cookie-consent__btn').addEventListener('click', accept);
  }

  function showIfNeeded() {
    var ok = false;
    try {
      ok = localStorage.getItem(KEY) === '1';
    } catch (e) {}
    if (ok || !bar) return;
    bar.classList.add('is-visible');
    bar.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cookie-consent-visible');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      buildBar();
      showIfNeeded();
    });
  } else {
    buildBar();
    showIfNeeded();
  }
})();
