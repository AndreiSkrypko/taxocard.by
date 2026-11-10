(function () {
  function removeLeadModal() {
    var m = document.getElementById('lead-modal');
    if (m) m.remove();
    document.body.classList.remove('lead-modal-open', 'allow-b24-popup');
  }
  removeLeadModal();
  document.addEventListener('DOMContentLoaded', removeLeadModal);

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
    if (e.key === 'Escape') setDrawer(false);
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('.b24 a[href="#"], a.b1c[href="#"], [data-b24-proxy][href="#"]')) setDrawer(false);
  });

  document.addEventListener('click', function (e) {
    var proxy = e.target.closest('[data-b24-proxy]');
    if (proxy) {
      var main = document.getElementById('b24-trigger-' + proxy.getAttribute('data-b24-proxy'));
      if (main) {
        e.preventDefault();
        main.click();
      }
      return;
    }
    var a = e.target.closest('a[href="#"]');
    if (a && !a.closest('.b24') && !a.classList.contains('b1c') && !a.hasAttribute('data-b24-proxy')) e.preventDefault();
  });

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
