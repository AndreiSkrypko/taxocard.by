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
      '<p class="lead-modal__eyebrow">Онлайн-заявка</p>' +
      '<h2 id="lead-modal-title" class="lead-modal__title">Свяжемся с вами</h2>' +
      '<p class="lead-modal__aside-text">Менеджер TaxoCARD перезвонит, уточнит детали и подскажет по документам. Без предоплаты за консультацию.</p>' +
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

  function showLeadForm(form) {
    var wrap = document.getElementById('lead-modal-forms');
    if (!wrap) return;
    var key = form.id + '-' + form.sec;
    wrap.querySelectorAll('.lead-modal__host').forEach(function (el) {
      el.hidden = el.getAttribute('data-form-key') !== key;
    });
    if (wrap.querySelector('[data-form-key="' + key + '"]')) return;
    var host = document.createElement('div');
    host.className = 'lead-modal__host b24-form-host is-loading';
    host.setAttribute('data-form-key', key);
    wrap.appendChild(host);
    var tag = document.createElement('script');
    tag.setAttribute('data-b24-form', 'inline/' + form.id + '/' + form.sec);
    tag.setAttribute('data-skip-moving', 'true');
    tag.textContent = b24LoaderCode(form.id);
    host.appendChild(tag);
    if ('MutationObserver' in window) {
      var obs = new MutationObserver(function () {
        if (host.querySelector('.b24-form-wrapper, .b24-form')) {
          host.classList.remove('is-loading');
          host.classList.add('is-ready');
          polishB24Fields(host);
          obs.disconnect();
        }
      });
      obs.observe(host, { childList: true, subtree: true });
    }
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
    document.querySelectorAll('.b24-window, .b24-window-overlay, .bx-crm-form-popup').forEach(function (el) {
      el.remove();
    });
  }

  function openZayavkaModal(form) {
    killB24Popups();
    setLeadModal(true, form);
  }

  function isCallbackB24Link(link) {
    var box = link.closest('.b24');
    if (!box) return false;
    var script = box.querySelector('script[data-b24-form]');
    if (!script) return false;
    var type = script.getAttribute('data-b24-form') || '';
    return type.indexOf('click/1/') !== -1;
  }

  function handleLeadClick(e) {
    var zayavka = e.target.closest('[data-b24-zayavka]');
    if (zayavka) {
      e.preventDefault();
      e.stopPropagation();
      setDrawer(false);
      openZayavkaModal();
      return;
    }
    var b24btn = e.target.closest('.b24 a[href="#"]');
    if (b24btn && !isCallbackB24Link(b24btn)) {
      e.preventDefault();
      e.stopPropagation();
      setDrawer(false);
      openZayavkaModal(b24FormOfLink(b24btn));
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
        killB24Popups();
        return;
      }
      records.forEach(function (record) {
        record.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.classList && (node.classList.contains('b24-window') || node.classList.contains('b24-window-overlay'))) {
            if (!document.body.classList.contains('allow-b24-popup')) {
              node.remove();
            }
          }
        });
      });
    });
    b24PopupBlocker.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('click', function (e) {
      if (isCallbackB24Link(e.target.closest('a') || e.target)) {
        document.body.classList.add('allow-b24-popup');
        setTimeout(function () { document.body.classList.remove('allow-b24-popup'); }, 2000);
      }
    }, true);
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
})();
