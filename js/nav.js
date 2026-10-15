/* Shared site navigation for every page.
   Edit the menu here once and all pages update.

   Each page provides:
     <html data-root="../" data-page="services">   (path back to the site root, current section)
     <div id="siteNav"></div><script src="../js/nav.js"></script>

   Desktop (> 1100px): sticky navbar with mega menus for Services and Work.
   Tablet / mobile:    hamburger opens a slide-in drawer with expandable sections.
   GSAP (loaded later on the page) adds the staggered entrance animations. */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var ROOT = docEl.getAttribute('data-root') || '';
  var PAGE = docEl.getAttribute('data-page') || 'home';
  var CURRENT_SERVICE = docEl.getAttribute('data-service') || '';
  // Pages without a dark hero (e.g. the blog) use data-header="solid" so the bar starts white.
  var SOLID = docEl.getAttribute('data-header') === 'solid';

  function url(path) { return (ROOT + path) || './'; }

  /* ---------- Menu content ---------- */
  var SERVICE_GROUPS = [
    { title: 'Design &amp; Build', items: [
      ['custom-web-design', 'Custom Web Design', 'Websites built to convert', 'web'],
      ['ecommerce-development', 'E-commerce Development', 'Online stores that drive sales', 'cart'],
      ['custom-web-applications', 'Custom Web Applications', 'Portals, dashboards and tools', 'code'],
      ['website-maintenance', 'Website Maintenance', 'Security, updates and backups', 'tools']
    ] },
    { title: 'Growth &amp; Marketing', items: [
      ['seo-services', 'Local SEO Services', 'Get found by nearby customers', 'local'],
      ['digital-marketing', 'Digital Marketing', 'Campaigns built for revenue', 'megaphone'],
      ['marketplace-management', 'Marketplace Management', 'Win on major marketplaces', 'store'],
      ['crm-integration', 'CRM Integration', 'Connect and automate your CRM', 'crm']
    ] },
    { title: 'Strategy &amp; AI', items: [
      ['digital-consulting', 'Digital Consulting', 'Roadmaps tied to real ROI', 'consult'],
      ['ai-strategy', 'AI Strategy &amp; Integration', 'Agents and smart automations', 'ai'],
      ['ai-search-optimization', 'AI Search Optimization', 'Show up in AI answers', 'spark']
    ] }
  ];

  var WORK_LINKS = [
    ['portfolio/', 'All Projects', 'Browse our full portfolio'],
    ['portfolio/', 'Case Studies', 'How we solved real business problems'],
    ['industries/', 'Industries We Serve', 'Experience across 20 sectors'],
    ['services/', 'What We Do', 'Every service under one roof']
  ];

  var FEATURED = [
    ['MotoX Powersports', 'Website Redesign &amp; Digital Strategy', 'photo-1558981806-ec527fa84c39'],
    ['CareWell Health', 'Service Launch &amp; Digital Marketing', 'photo-1631217868264-e5b90bb7e133'],
    ['Summit Solar', 'Lead-Generation Website', 'photo-1509391366360-2e959784a276']
  ];

  var CONTACT = {
    phone: '+8801580391983',
    tel: '+8801580391983',
    email: 'contact@codelynxdigital.com',
    address: ['House-08, Road-22, Block-D, Section-6, Mirpur-1216', 'Dhaka, Bangladesh']
  };

  var ICONS = {
    web: '<rect x="5" y="9" width="38" height="30" rx="2"/><path d="M5 16h38M11 22h12M11 27h20M11 32h16"/>',
    cart: '<path d="M3 7h6l4.5 21H37l4-15H11"/><circle cx="17" cy="36" r="3"/><circle cx="33" cy="36" r="3"/>',
    code: '<rect x="7" y="9" width="34" height="23" rx="2"/><path d="M3 38h42M20 16l-5 4.5 5 4.5M28 16l5 4.5-5 4.5"/>',
    tools: '<path d="M29 7a8 8 0 0 0-8.6 10.6L7 31a3.5 3.5 0 0 0 5 5l13.4-13.4A8 8 0 0 0 36 14l-4.5 4.5-4-1-1-4z"/>',
    local: '<path d="M24 43s-13-12.2-13-22a13 13 0 0 1 26 0c0 9.8-13 22-13 22z"/><circle cx="24" cy="20" r="5"/>',
    megaphone: '<path d="M8 19v10h6l14 8V11l-14 8z"/><path d="M14 29l3 10h4l-2-9M34 17a8 8 0 0 1 0 14"/>',
    store: '<path d="M7 19v22h34V19M5 7h38l2 10a5 5 0 0 1-10 0 5 5 0 0 1-10 0 5 5 0 0 1-10 0 5 5 0 0 1-10 0z"/><path d="M19 41V29h10v12"/>',
    crm: '<circle cx="24" cy="11" r="5"/><circle cx="10" cy="35" r="5"/><circle cx="38" cy="35" r="5"/><path d="m21.5 15.5-9 15M26.5 15.5l9 15M15 35h18"/>',
    consult: '<circle cx="24" cy="24" r="18"/><path d="m30.5 17.5-4 9-9 4 4-9z"/>',
    ai: '<rect x="13" y="13" width="22" height="22" rx="3"/><path d="M19 4v9M29 4v9M19 35v9M29 35v9M4 19h9M4 29h9M35 19h9M35 29h9"/>',
    spark: '<circle cx="20" cy="20" r="11"/><path d="m28 28 12 12M20 13l1.8 4.2L26 19l-4.2 1.8L20 25l-1.8-4.2L14 19l4.2-1.8z"/>'
  };
  var CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M15 7l5 5-5 5"/></svg>';

  function icon(name) {
    return '<svg class="mega__svg" viewBox="0 0 48 48" aria-hidden="true">' + ICONS[name] + '</svg>';
  }
  // The second (white) copy is only shown over dark backgrounds; see .logo__img--rev in style.css.
  function logo(extra) {
    var src = url('images/logo-with-brand.webp');
    return '<a href="' + url('') + '" class="logo' + (extra || '') + '" aria-label="Codelynx Digital home">' +
      '<span class="logo__crop"><img src="' + src + '" alt="Codelynx Digital" class="logo__img" width="1536" height="1024">' +
      '<img src="' + src + '" alt="" class="logo__img logo__img--rev" width="1536" height="1024"></span></a>';
  }

  /* ---------- Mega menu panels ---------- */
  function servicesMega() {
    var cols = SERVICE_GROUPS.map(function (g) {
      var items = g.items.map(function (s) {
        var cur = s[0] === CURRENT_SERVICE ? ' aria-current="page"' : '';
        return '<li><a class="mega__link" href="' + url('services/' + s[0] + '/') + '"' + cur + '>' +
          '<span class="mega__icon">' + icon(s[3]) + '</span>' +
          '<span><strong>' + s[1] + '</strong><small>' + s[2] + '</small></span></a></li>';
      }).join('');
      return '<div class="mega__group"><p class="mega__label">' + g.title + '</p><ul>' + items + '</ul></div>';
    }).join('');
    return '<div class="mega" id="mega-services" data-mega>' +
      '<div class="container mega__inner mega__inner--services">' +
        '<div class="mega__cols">' + cols + '</div>' +
        '<aside class="mega__promo glow">' +
          '<p class="mega__label mega__label--light">Free Consultation</p>' +
          '<h3>Not sure where to start?</h3>' +
          '<p>Tell us about your goals and we will recommend the right mix of services for your business.</p>' +
          '<a class="btn btn--dark" href="' + url('contact/') + '">Book a Free Call</a>' +
          '<a class="mega__all" href="' + url('services/') + '">View all services ' + ARROW + '</a>' +
        '</aside>' +
      '</div></div>';
  }

  function workMega() {
    var links = WORK_LINKS.map(function (l) {
      return '<li><a class="mega__row" href="' + url(l[0]) + '"><span><strong>' + l[1] + '</strong><small>' + l[2] + '</small></span>' + ARROW + '</a></li>';
    }).join('');
    var cards = FEATURED.map(function (f) {
      return '<a class="mega-card" href="' + url('portfolio/') + '">' +
        '<span class="mega-card__img"><img src="' + url('assets/images/' + f[2] + '-520x340.webp') + '" alt="" loading="lazy"></span>' +
        '<span class="mega-card__client">' + f[0] + '</span><strong>' + f[1] + '</strong></a>';
    }).join('');
    return '<div class="mega" id="mega-work" data-mega>' +
      '<div class="container mega__inner mega__inner--work">' +
        '<div><p class="mega__label">Our Work</p><ul class="mega__rows">' + links + '</ul></div>' +
        '<div><p class="mega__label">Featured Projects</p><div class="mega__cards">' + cards + '</div></div>' +
      '</div></div>';
  }

  /* ---------- Main links ---------- */
  var MAIN = [
    { key: 'services', label: 'Services', href: 'services/', mega: servicesMega },
    { key: 'work', label: 'Work', href: 'portfolio/', mega: workMega },
    { key: 'industries', label: 'Industries', href: 'industries/' },
    { key: 'about', label: 'About', href: 'about/' },
    { key: 'insights', label: 'Insights', href: 'insights/' },
    { key: 'contact', label: 'Contact', href: 'contact/' }
  ];

  function desktopNav() {
    return MAIN.map(function (m) {
      var cur = m.key === PAGE ? ' is-current' : '';
      if (!m.mega) {
        return '<li class="nav__item' + cur + '"><a class="nav__link" href="' + url(m.href) + '">' + m.label + '</a></li>';
      }
      return '<li class="nav__item nav__item--mega' + cur + '" data-mega-item>' +
        '<a class="nav__link" href="' + url(m.href) + '">' + m.label + '</a>' +
        '<button class="nav__caret" type="button" aria-expanded="false" aria-controls="mega-' + m.key + '" aria-label="Show ' + m.label + ' menu">' + CHEVRON + '</button>' +
        m.mega() + '</li>';
    }).join('');
  }

  function drawerNav() {
    return MAIN.map(function (m) {
      var cur = m.key === PAGE ? ' is-current' : '';
      if (!m.mega) {
        return '<li class="drawer__item' + cur + '"><a class="drawer__link" href="' + url(m.href) + '">' + m.label + '</a></li>';
      }
      var sub;
      if (m.key === 'services') {
        sub = SERVICE_GROUPS.map(function (g) {
          return '<li class="drawer__group">' + g.title + '</li>' + g.items.map(function (s) {
            return '<li><a href="' + url('services/' + s[0] + '/') + '">' + s[1] + '</a></li>';
          }).join('');
        }).join('');
      } else {
        sub = WORK_LINKS.map(function (l) { return '<li><a href="' + url(l[0]) + '">' + l[1] + '</a></li>'; }).join('');
      }
      return '<li class="drawer__item' + cur + '">' +
        '<div class="drawer__row"><a class="drawer__link" href="' + url(m.href) + '">' + m.label + '</a>' +
        '<button class="drawer__toggle" type="button" aria-expanded="false" aria-controls="dsub-' + m.key + '" aria-label="Show ' + m.label + ' links">' + CHEVRON + '</button></div>' +
        '<div class="drawer__sub" id="dsub-' + m.key + '"><ul>' + sub + '</ul></div></li>';
    }).join('');
  }

  /* ---------- Render ---------- */
  var mount = document.getElementById('siteNav');
  if (!mount) return;
  mount.outerHTML =
    '<header class="site-header" id="siteHeader">' +
      '<div class="site-header__inner">' +
        logo() +
        '<nav class="nav" aria-label="Main"><ul class="nav__list">' + desktopNav() + '</ul></nav>' +
        '<a class="btn btn--dark nav__cta" href="' + url('contact/') + '">Get a Free Quote</a>' +
        '<button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="siteDrawer" aria-label="Open menu"><span></span><span></span><span></span></button>' +
      '</div>' +
    '</header>' +
    '<div class="drawer" id="siteDrawer" aria-hidden="true">' +
      '<div class="drawer__backdrop" data-drawer-close></div>' +
      '<aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="Site menu">' +
        '<div class="drawer__top">' + logo(' logo--drawer') +
          '<button class="drawer__close" type="button" data-drawer-close aria-label="Close menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '</div>' +
        '<nav class="drawer__nav" aria-label="Main"><ul>' + drawerNav() + '</ul></nav>' +
        '<div class="drawer__foot">' +
          '<p class="drawer__label">Get In Touch</p>' +
          '<address class="drawer__address">' + CONTACT.address.join('<br>') + '</address>' +
          '<a href="mailto:' + CONTACT.email + '">' + CONTACT.email + '</a>' +
          '<a href="tel:' + CONTACT.tel + '">' + CONTACT.phone + '</a>' +
          '<a class="btn btn--dark" href="' + url('contact/') + '">Get a Free Quote</a>' +
        '</div>' +
      '</aside>' +
    '</div>';

  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('menuToggle');
  var drawer = document.getElementById('siteDrawer');
  var panel = drawer.querySelector('.drawer__panel');
  var desktopMQ = window.matchMedia('(min-width: 1101px)');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function gsapOK() { return window.gsap && !reduceMotion; }

  /* ---------- Sticky header state ---------- */
  function onScroll() { header.classList.toggle('is-scrolled', SOLID || window.scrollY > 20); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Desktop mega menus ---------- */
  var megaItems = Array.prototype.slice.call(header.querySelectorAll('[data-mega-item]'));
  var closeTimer;

  function setMega(item, open) {
    var btn = item.querySelector('.nav__caret');
    if (item.classList.contains('is-open') === open) return;
    item.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    if (open && gsapOK()) {
      var bits = item.querySelectorAll('.mega__group, .mega__promo, .mega__rows li, .mega-card');
      window.gsap.fromTo(bits, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.04, overwrite: true });
    }
    header.classList.toggle('has-mega', megaItems.some(function (m) { return m.classList.contains('is-open'); }));
  }
  function closeAll(except) {
    megaItems.forEach(function (m) { if (m !== except) setMega(m, false); });
  }

  megaItems.forEach(function (item) {
    var btn = item.querySelector('.nav__caret');
    item.addEventListener('mouseenter', function () {
      if (!desktopMQ.matches) return;
      clearTimeout(closeTimer);
      closeAll(item);
      setMega(item, true);
    });
    item.addEventListener('mouseleave', function () {
      if (!desktopMQ.matches) return;
      closeTimer = setTimeout(function () { setMega(item, false); }, 160);
    });
    btn.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      closeAll(item);
      setMega(item, open);
      if (open) {
        var first = item.querySelector('.mega a');
        if (first) first.focus();
      }
    });
    // Close when keyboard focus leaves the item.
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) setMega(item, false);
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-mega-item]')) closeAll();
  });

  /* ---------- Drawer (tablet / mobile) ---------- */
  var lastFocus = null;

  function setDrawer(open) {
    if (drawer.classList.contains('is-open') === open) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    if (open) {
      lastFocus = document.activeElement;
      drawer.querySelector('.drawer__close').focus();
      if (gsapOK()) {
        window.gsap.fromTo(drawer.querySelectorAll('.drawer__nav > ul > li, .drawer__foot > *'),
          { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out', stagger: 0.05, delay: 0.15, overwrite: true });
      }
    } else {
      // Return focus to whatever opened the drawer (the hamburger in practice).
      var back = lastFocus && lastFocus !== document.body ? lastFocus : toggle;
      back.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener('click', function () { setDrawer(!drawer.classList.contains('is-open')); });
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('[data-drawer-close]') || e.target.closest('.drawer__nav a, .drawer__foot a')) setDrawer(false);
  });

  // Expandable sections inside the drawer.
  drawer.querySelectorAll('.drawer__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.closest('.drawer__item').classList.toggle('is-expanded', open);
      if (open && gsapOK()) {
        window.gsap.fromTo(btn.closest('.drawer__item').querySelectorAll('.drawer__sub li'),
          { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.03, overwrite: true });
      }
    });
  });

  // Keep keyboard focus inside the open drawer.
  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusables = Array.prototype.filter.call(panel.querySelectorAll('a, button'), function (el) { return el.offsetParent !== null; });
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Escape closes whatever is open.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (drawer.classList.contains('is-open')) { setDrawer(false); return; }
    var open = megaItems.filter(function (m) { return m.classList.contains('is-open'); })[0];
    if (open) { setMega(open, false); open.querySelector('.nav__caret').focus(); }
  });

  // Switching between desktop and drawer layouts closes both menus.
  function onLayoutChange() { setDrawer(false); closeAll(); }
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', onLayoutChange);
  else desktopMQ.addListener(onLayoutChange);
})();
