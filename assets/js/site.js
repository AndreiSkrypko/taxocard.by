(function () {
  var doc = document.documentElement;
  if (!doc.classList.contains('js')) doc.classList.add('js');

  var header = document.getElementById('header');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 10);
    if (toTop) toTop.classList.toggle('is-visible', y > 700);
    doc.classList.toggle('past-hero', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var premiumHero = document.querySelector('[data-hero-premium]');
  if (premiumHero) {
    requestAnimationFrame(function () {
      premiumHero.classList.add('is-live');
    });
  }

  var drawer = document.getElementById('drawer');
  var burger = document.querySelector('.burger');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { setDrawer(true); });
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer || e.target.closest('.drawer__close') || e.target.closest('.drawer__menu a')) {
        setDrawer(false);
      }
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var modal = document.getElementById('lead-modal');
    if (modal && modal.classList.contains('is-open')) {
      setLeadModal(false);
      return;
    }
    setDrawer(false);
  });

  var B24_DEFAULT_FORM = { id: '17', sec: 'vqtplx' };
  var B24_ZAYAVKA_FORM = { id: '17', sec: 'vqtplx' };

  function b24LoaderCode(id) {
    return "(function(w,d,u){var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);})(window,document,'https://cdn-ru.bitrix24.by/b27507608/crm/form/loader_" + id + ".js');";
  }

  function b24FormOfLink(link) {
    var box = link && link.closest('.b24');
    var script = box && box.querySelector('script[data-b24-form]');
    var m = script && /^click\/(\d+)\/(\w+)$/.exec(script.getAttribute('data-b24-form') || '');
    return m ? { id: m[1], sec: m[2] } : B24_DEFAULT_FORM;
  }

  function ensureLeadModal() {
    var modal = document.getElementById('lead-modal');
    if (modal && !modal.querySelector('#lead-modal-forms')) {
      modal.remove();
      modal = null;
    }
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'lead-modal';
    modal.className = 'lead-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="lead-modal__overlay" data-lead-modal-close tabindex="-1"></div>' +
      '<div class="lead-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">' +
      '<button type="button" class="lead-modal__close" data-lead-modal-close aria-label="Закрыть"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>' +
      '<div class="lead-modal__layout">' +
      '<aside class="lead-modal__aside">' +
      '<div class="lead-modal__icon" aria-hidden="true"><i class="fa-solid fa-phone-volume"></i></div>' +
      '<p class="lead-modal__eyebrow">Заявка на консультацию</p>' +
      '<h2 id="lead-modal-title" class="lead-modal__title">Свяжемся с вами</h2>' +
      '<p class="lead-modal__aside-text">Менеджер TaxoCARD перезвонит, уточнит детали и подскажет по документам. Консультация бесплатна, услуги — по договору.</p>' +
      '<ul class="lead-modal__perks">' +
      '<li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Ответ Пн–Сб, 9:00–20:00</span></li>' +
      '<li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Чип-карта и КОД 95</span></li>' +
      '<li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>Договор и чек на услуги</span></li>' +
      '</ul>' +
      '<a class="lead-modal__call" href="tel:+375298577788"><i class="fa-solid fa-phone" aria-hidden="true"></i>+375 (29) 857-77-88</a>' +
      '</aside>' +
      '<div class="lead-modal__main">' +
      '<p class="lead-modal__hint">Имя и телефон — этого достаточно для первого звонка</p>' +
      '<div class="lead-modal__forms" id="lead-modal-forms"></div>' +
      '<p class="lead-modal__legal">Оператор: ООО «Нексора Групп», УНП 693426799. ' +
      '<a href="/politika-konfidencialnosti.html">Политика конфиденциальности</a> · ' +
      '<a href="/usloviya-uslug.html">Условия услуг</a></p>' +
      '</div></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-lead-modal-close]')) setLeadModal(false);
    });
    return modal;
  }

  function isLeadModalNode(el) {
    return !!(el && el.closest && el.closest('#lead-modal'));
  }

  function activeLeadFormHost() {
    var wrap = document.getElementById('lead-modal-forms');
    if (!wrap) return null;
    return wrap.querySelector('.lead-modal__host:not([hidden])') || wrap.querySelector('.lead-modal__host');
  }

  function markLeadHostReady(host) {
    if (!host) return;
    host.classList.remove('is-loading');
    host.classList.add('is-ready');
    polishB24Fields(host);
  }

  function leadFormHasMarkup(host) {
    return !!(host && host.querySelector('.b24-form-wrapper, .b24-form, .b24-window .b24-form'));
  }

  function adoptB24IntoLeadModal() {
    var host = activeLeadFormHost();
    var modal = document.getElementById('lead-modal');
    if (!host || !modal || !modal.classList.contains('is-open')) return false;
    if (leadFormHasMarkup(host)) {
      markLeadHostReady(host);
      return true;
    }
    var adopted = false;
    document.querySelectorAll('body > .b24-window').forEach(function (win) {
      if (win.querySelector('.b24-form-wrapper, .b24-form')) {
        host.appendChild(win);
        adopted = true;
      }
    });
    if (adopted || leadFormHasMarkup(host)) {
      markLeadHostReady(host);
      return true;
    }
    return false;
  }

  function showLeadForm(form) {
    var wrap = document.getElementById('lead-modal-forms');
    if (!wrap) return;
    var key = form.id + '-' + form.sec;
    wrap.querySelectorAll('.lead-modal__host').forEach(function (el) {
      el.hidden = el.getAttribute('data-form-key') !== key;
    });
    var host = wrap.querySelector('[data-form-key="' + key + '"]');
    if (!host) {
      host = document.createElement('div');
      host.className = 'lead-modal__host b24-form-host is-loading';
      host.setAttribute('data-form-key', key);
      wrap.appendChild(host);
      var tag = document.createElement('script');
      tag.setAttribute('data-b24-form', 'click/' + form.id + '/' + form.sec);
      tag.setAttribute('data-skip-moving', 'true');
      tag.textContent = b24LoaderCode(form.id);
      host.appendChild(tag);
      var trigger = document.createElement('a');
      trigger.href = '#';
      trigger.setAttribute('hidden', 'hidden');
      trigger.setAttribute('aria-hidden', 'true');
      host.appendChild(trigger);
      window.setTimeout(function () {
        allowB24Popup(15000);
        if (trigger) trigger.click();
      }, 400);
    } else if (leadFormHasMarkup(host)) {
      markLeadHostReady(host);
      return;
    } else {
      host.classList.add('is-loading');
      host.classList.remove('is-ready');
    }
    var done = false;
    function tryReady() {
      if (done) return;
      if (adoptB24IntoLeadModal() || leadFormHasMarkup(host)) {
        done = true;
        markLeadHostReady(host);
      }
    }
    if ('MutationObserver' in window) {
      var obs = new MutationObserver(tryReady);
      obs.observe(host, { childList: true, subtree: true });
      obs.observe(document.body, { childList: true, subtree: false });
      setTimeout(function () { obs.disconnect(); }, 15000);
    }
    var tries = 0;
    var poll = setInterval(function () {
      tries += 1;
      tryReady();
      if (done || tries > 40) clearInterval(poll);
    }, 250);
    setTimeout(function () {
      if (done || !host.classList.contains('is-loading')) return;
      host.classList.remove('is-loading');
      host.innerHTML =
        '<p class="lead-modal__load-fail">Не удалось загрузить форму. ' +
        '<a href="tel:+375298577788">Позвоните</a> или нажмите «Заказать звонок» в шапке.</p>';
    }, 12000);
    polishB24Fields(host);
  }

  function polishB24Fields(host) {
    if (!host) return;
    host.querySelectorAll('.b24-form-control').forEach(function (input) {
      if (input.dataset.tcPolished) return;
      input.dataset.tcPolished = '1';
      var wrap = input.closest('.b24-form-control-container') || input.parentElement;
      function sync() {
        if (!wrap) return;
        wrap.classList.toggle('b24-field-filled', !!String(input.value || '').trim());
      }
      input.addEventListener('input', sync);
      input.addEventListener('change', sync);
      input.addEventListener('blur', sync);
      sync();
    });
  }

  function setLeadModal(open, form) {
    var modal = ensureLeadModal();
    if (open) showLeadForm(form || B24_DEFAULT_FORM);
    modal.classList.toggle('is-open', open);
    modal.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.classList.toggle('lead-modal-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var closeBtn = modal.querySelector('.lead-modal__close');
      if (closeBtn) closeBtn.focus();
    }
  }

  function killB24Popups() {
    if (document.body.classList.contains('lead-modal-open')) {
      adoptB24IntoLeadModal();
    }
    document.querySelectorAll('.b24-window, .b24-window-overlay, .bx-crm-form-popup').forEach(function (el) {
      if (isLeadModalNode(el)) return;
      if (el.classList.contains('b24-window') && document.body.classList.contains('lead-modal-open')) {
        adoptB24IntoLeadModal();
        if (activeLeadFormHost() && activeLeadFormHost().contains(el)) return;
      }
      el.remove();
    });
  }

  function openZayavkaModal(form) {
    setLeadModal(true, form);
    killB24Popups();
  }

  function allowB24Popup(ms) {
    document.body.classList.add('allow-b24-popup');
    setTimeout(function () { document.body.classList.remove('allow-b24-popup'); }, ms || 5000);
  }

  function ensureZayavkaB24Sink() {
    var sink = document.getElementById('b24-zayavka-sink');
    if (sink) return sink;
    sink = document.createElement('div');
    sink.id = 'b24-zayavka-sink';
    sink.className = 'b24';
    sink.setAttribute('aria-hidden', 'true');
    sink.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
    var tag = document.createElement('script');
    tag.setAttribute('data-b24-form', 'click/' + B24_ZAYAVKA_FORM.id + '/' + B24_ZAYAVKA_FORM.sec);
    tag.setAttribute('data-skip-moving', 'true');
    tag.textContent = b24LoaderCode(B24_ZAYAVKA_FORM.id);
    sink.appendChild(tag);
    var link = document.createElement('a');
    link.href = '#';
    link.textContent = 'Заявка';
    sink.appendChild(link);
    document.body.appendChild(sink);
    return sink;
  }

  function b24FormVisible() {
    return !!document.querySelector('.b24-window .b24-form, .b24-form-wrapper, .lead-modal.is-open .b24-form');
  }

  function openZayavkaClickForm() {
    setDrawer(false);
    setLeadModal(false);
    allowB24Popup(15000);
    var sink = ensureZayavkaB24Sink();
    var link = sink.querySelector('a[href="#"]');
    if (link) link.click();
    window.setTimeout(function () {
      if (!b24FormVisible()) setLeadModal(true, B24_ZAYAVKA_FORM);
    }, 2000);
  }

  function armB24Click(link, form) {
    setDrawer(false);
    allowB24Popup(15000);
    window.setTimeout(function () {
      if (!b24FormVisible() && form) setLeadModal(true, form);
    }, 2000);
  }

  function handleLeadClick(e) {
    var zayavka = e.target.closest('[data-b24-zayavka]');
    if (zayavka) {
      e.preventDefault();
      e.stopPropagation();
      openZayavkaClickForm();
      return;
    }
    var b24btn = e.target.closest('.b24 a[href="#"]');
    if (b24btn) {
      armB24Click(b24btn, b24FormOfLink(b24btn));
    }
  }

  document.addEventListener('click', handleLeadClick, true);

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#"]');
    if (a && !a.closest('.b24')) e.preventDefault();
  });

  if ('MutationObserver' in window) {
    var b24PopupBlocker = new MutationObserver(function (records) {
      if (document.getElementById('lead-modal') && document.getElementById('lead-modal').classList.contains('is-open')) {
        adoptB24IntoLeadModal();
        document.querySelectorAll('body > .b24-window-overlay').forEach(function (el) {
          if (!isLeadModalNode(el)) el.remove();
        });
        return;
      }
      if (document.body.classList.contains('allow-b24-popup')) return;
      records.forEach(function (record) {
        record.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.classList && node.classList.contains('b24-window')) {
            adoptB24IntoLeadModal();
          }
        });
      });
    });
    b24PopupBlocker.observe(document.body, { childList: true, subtree: true });
  }

  function isLegacyPageBlock(el) {
    var cn = typeof el.className === 'string' ? el.className : '';
    if (el.classList.contains('socials-section')) return true;
    if (/\btp[-a-z]|tpfeature|searvice-area|legacy-course|scroll-anchor|accordion-area\b/i.test(cn)) return true;
    return false;
  }

  document.querySelectorAll('[data-background]').forEach(function (el) {
    if (el.classList.contains('tpfeature-area')) return;
    var url = el.getAttribute('data-background');
    if (url) {
      el.style.backgroundImage = 'url("' + url.replace(/"/g, '') + '")';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
    }
  });

  document.querySelectorAll('.page-content > div, .page-content > section').forEach(function (block) {
    if (block.classList.contains('reveal') || block.offsetHeight < 48) return;
    if (isLegacyPageBlock(block)) return;
    block.classList.add('reveal');
  });

  document.querySelectorAll('.grid, .steps, .reviews__list, .promo-stack, .docs__grid').forEach(function (group) {
    group.querySelectorAll(':scope > .reveal').forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', i * 70 + 'ms');
    });
  });

  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach(function (el) {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', '0ms');
      }
      io.observe(el);
    });

    var counters = document.querySelectorAll('[data-count]');
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (Number.isNaN(target)) return;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1400, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
  }

  ensureZayavkaB24Sink();
})();
