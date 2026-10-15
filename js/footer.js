/* Shared site footer for every page.
   Edit the details below once and all pages update.

   Each page provides (the same data-root used by js/nav.js):
     <html data-root="../">
     <div id="siteFooter"></div><script src="../js/footer.js"></script> */
(function () {
  'use strict';

  var ROOT = document.documentElement.getAttribute('data-root') || '';
  function url(path) { return (ROOT + path) || './'; }

  /* ---------- Footer content ---------- */
  var COMPANY = {
    name: 'Codelynx Digital',
    address: ['123 Main Street', 'Suite A', 'Your City, ST 00000'],
    phone: '(000) 000-0000',
    tel: '+10000000000',
    email: 'hello@yourbrand.com',
    mainOffice: 'Your City, ST',
    satelliteOffices: 'Second City, ST | Third City, ST'
  };

  var BUDGET_CALCULATOR = '#';

  // Replace '#' with your real profile URLs.
  var SOCIAL = [
    ['LinkedIn', '#', '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM.5 8h4v16h-4zM8 8h3.8v2.2h.05c.53-1 1.84-2.2 3.8-2.2 4.05 0 4.8 2.67 4.8 6.13V24h-4v-7.9c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.17V24H8z"/></svg>'],
    ['Facebook', '#', '<svg viewBox="0 0 24 24"><path d="M14 8V6c0-.9.6-1 1-1h3V1h-4c-3.3 0-4 2.4-4 4v3H7v4h3v11h4V12h3.5l.5-4z"/></svg>'],
    ['Instagram', '#', '<svg viewBox="0 0 24 24" class="stroke"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.6" cy="6.4" r=".6"/></svg>']
  ];

  // [label, path from the site root]
  var SERVICES = [
    ['Custom Web Design', 'services/custom-web-design/'],
    ['E-commerce Development', 'services/ecommerce-development/'],
    ['SEO Services', 'services/seo-services/'],
    ['Digital Marketing', 'services/digital-marketing/'],
    ['Custom Web Applications', 'services/custom-web-applications/'],
    ['Digital Consulting', 'services/digital-consulting/'],
    ['AI Consulting', 'services/ai-strategy/'],
    ['AI Site Optimization Tools', 'services/ai-search-optimization/'],
    ['Marketplace Management', 'services/marketplace-management/'],
    ['Website Maintenance', 'services/website-maintenance/']
  ];

  var COMPANY_LINKS = [
    ['About Us', 'about/'],
    ['Our Work', 'portfolio/'],
    ['Our Services', 'services/'],
    ['Industry Experience', 'industries/'],
    ['Insights', 'insights/'],
    ['Contact Us', 'contact/'],
    ['Request a Quote', 'contact/'],
    ['FAQs', '#faq']
  ];

  // Replace '#' once these pages exist.
  var LEGAL = [
    ['Accessibility Statement', '#'],
    ['Terms of Service', '#'],
    ['Privacy Policy', '#'],
    ['Sitemap', '#']
  ];

  /* ---------- Render ---------- */
  function list(items, internal) {
    return items.map(function (i) {
      return '<li><a href="' + (internal ? url(i[1]) : i[1]) + '">' + i[0] + '</a></li>';
    }).join('');
  }

  var mount = document.getElementById('siteFooter');
  if (!mount) return;

  mount.outerHTML =
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="footer__grid">' +
          '<div class="footer__col footer__brand">' +
            '<a href="' + url('') + '" class="logo logo--footer" aria-label="' + COMPANY.name + ' home">' +
              '<span class="logo__crop"><img src="' + url('images/logo-with-brand.png') + '" alt="' + COMPANY.name + '" class="logo__img" width="1536" height="1024" loading="lazy">' +
              '<img src="' + url('images/logo-with-brand.png') + '" alt="" class="logo__img logo__img--rev" width="1536" height="1024" loading="lazy"></span></a>' +
            '<address>' + COMPANY.address.join('<br>') + '<br><a href="tel:' + COMPANY.tel + '">' + COMPANY.phone + '</a></address>' +
            '<a href="' + BUDGET_CALCULATOR + '" class="footer__calc">Budget Calculator</a>' +
            '<ul class="social">' + SOCIAL.map(function (s) {
              return '<li><a href="' + s[1] + '" aria-label="' + s[0] + '">' + s[2] + '</a></li>';
            }).join('') + '</ul>' +
          '</div>' +
          '<div class="footer__col">' +
            '<h3>Get In Touch</h3>' +
            '<p><a href="mailto:' + COMPANY.email + '">' + COMPANY.email + '</a><br><a href="tel:' + COMPANY.tel + '">' + COMPANY.phone + '</a></p>' +
            '<h4>Main Office</h4><p>' + COMPANY.mainOffice + '</p>' +
            '<h4>Satellite Offices</h4><p>' + COMPANY.satelliteOffices + '</p>' +
          '</div>' +
          '<div class="footer__col"><h3>Services</h3><ul>' + list(SERVICES, true) + '</ul></div>' +
          '<div class="footer__col"><h3>Company</h3><ul>' + list(COMPANY_LINKS, true) + '</ul></div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<p>&copy;' + new Date().getFullYear() + ' ' + COMPANY.name + '. All rights reserved.</p>' +
          '<ul class="footer__legal">' + list(LEGAL, false) + '</ul>' +
        '</div>' +
      '</div>' +
    '</footer>';
})();
