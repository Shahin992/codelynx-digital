/* Site interactions. Animations use GSAP + ScrollTrigger (loaded from cdnjs
   before this file). Without GSAP, or with reduced motion, content simply
   shows without animation. */
(function () {
  'use strict';

  var root = document.documentElement;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var animate = !!(gsap && ScrollTrigger) && !reduceMotion;

  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (!animate) root.classList.add('no-anim');

  /* Header, mega menus and drawer live in js/nav.js (shared by every page). */

  /* ---------- Split headings into words (animated word by word) ---------- */
  function splitWords(el) {
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(' '));
              return;
            }
            var word = document.createElement('span');
            var inner = document.createElement('span');
            word.className = 'word';
            inner.className = 'word__inner';
            inner.textContent = part;
            word.appendChild(inner);
            frag.appendChild(word);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(el);
  }
  document.querySelectorAll('.split').forEach(splitWords);

  /* ---------- Scroll animations (GSAP) ---------- */
  if (animate) {
    // The first section (the hero) is already visible when the page paints (see style.css),
    // so its content only slides into place instead of fading in from hidden.
    var hero = document.querySelector('#main > section');
    var inHero = function (el) { return !!hero && hero.contains(el); };
    var notInHero = function (el) { return !inHero(el); };

    // Headings: words swoop up one after another.
    gsap.utils.toArray('.split').forEach(function (el) {
      var words = el.querySelectorAll('.word__inner');
      if (inHero(el)) {
        gsap.from(words, { yPercent: 35, duration: 0.9, ease: 'power3.out', stagger: 0.08 });
        return;
      }
      gsap.set(el, { visibility: 'visible' });
      gsap.from(words, {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });

    var heroItems = gsap.utils.toArray('.reveal, .swipe-up').filter(inHero);
    if (heroItems.length) {
      gsap.from(heroItems, { y: 30, duration: 1, ease: 'power2.out', stagger: 0.08, clearProps: 'transform' });
    }

    // Text, cards and buttons: fade up, staggered when several enter together.
    ScrollTrigger.batch(gsap.utils.toArray('.reveal').filter(notInHero), {
      start: 'top 92%',
      once: true,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.1, clearProps: 'transform' });
      }
    });

    // Images: wipe in from the bottom.
    ScrollTrigger.batch(gsap.utils.toArray('.swipe-up').filter(notInHero), {
      start: 'top 90%',
      once: true,
      onEnter: function (batch) {
        gsap.fromTo(batch,
          { autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0%)', y: 10 },
          { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.2, ease: 'expo.inOut', stagger: 0.1, clearProps: 'transform,clipPath' });
      }
    });

    // Everything is wired up: switch off the CSS failsafe.
    root.classList.add('anim-ready');
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  /* ---------- Hero browser mockup slideshow ---------- */
  var slides = document.querySelectorAll('.mockup__slide');
  if (slides.length > 1 && !reduceMotion) {
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 4500);
  }

  /* ---------- Carousels (infinite loop, slides tweened with GSAP) ---------- */
  document.querySelectorAll('.reviews').forEach(function (box) {
    var viewport = box.querySelector('.reviews__viewport');
    var track = box.querySelector('.reviews__track');
    var dotsWrap = box.querySelector('.reviews__dots');
    var originals = Array.prototype.slice.call(track.children);
    var count = originals.length;
    var GAP = 10;
    var index = 1;
    var busy = false;
    var timer;

    // Clone the last slide before the first and the first after the last for a seamless wrap.
    var headClone = originals[count - 1].cloneNode(true);
    var tailClone = originals[0].cloneNode(true);
    [headClone, tailClone].forEach(function (c) {
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('inert', '');
      c.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    });
    track.insertBefore(headClone, originals[0]);
    track.appendChild(tailClone);

    if (dotsWrap) {
      originals.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Show slide ' + (i + 1));
        dot.addEventListener('click', function () {
          if (busy || index === i + 1) return;
          go(i + 1 - index);
          restart();
        });
        dotsWrap.appendChild(dot);
      });
    }

    function syncDots() {
      if (!dotsWrap) return;
      var active = (index - 1 + count) % count;
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.setAttribute('aria-current', String(i === active));
      });
    }
    function offset() {
      return -index * (viewport.offsetWidth + GAP);
    }
    function jump() {
      if (gsap) gsap.set(track, { x: offset() });
      else track.style.transform = 'translateX(' + offset() + 'px)';
      syncDots();
    }
    function go(step) {
      if (busy) return;
      busy = true;
      index += step;
      syncDots();
      var settle = function () {
        if (index <= 0) index = count;
        if (index >= count + 1) index = 1;
        jump();
        busy = false;
      };
      if (gsap && !reduceMotion) {
        gsap.to(track, { x: offset(), duration: 0.6, ease: 'power2.inOut', onComplete: settle });
      } else {
        settle();
      }
    }
    function restart() {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { go(1); }, 5000);
    }

    box.querySelector('.reviews__arrow--prev').addEventListener('click', function () { go(-1); restart(); });
    box.querySelector('.reviews__arrow--next').addEventListener('click', function () { go(1); restart(); });
    box.addEventListener('mouseenter', function () { clearInterval(timer); });
    box.addEventListener('mouseleave', restart);
    window.addEventListener('resize', function () { if (!busy) jump(); });

    jump();
    restart();
  });

  /* ---------- Insights card stack ---------- */
  var stack = document.getElementById('postStack');
  if (stack) {
    var cards = Array.prototype.slice.call(stack.querySelectorAll('.post-card'));
    document.getElementById('postNext').addEventListener('click', function () {
      cards.forEach(function (card) {
        var pos = +card.dataset.pos;
        card.dataset.pos = pos === 0 ? cards.length - 1 : pos - 1;
      });
    });
  }

  /* ---------- FAQ: keep one item open at a time ---------- */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- AI pages: use-case tabs ---------- */
  document.querySelectorAll('.ai-tabs').forEach(function (box) {
    var buttons = box.querySelectorAll('.ai-tabs__btn');
    var panels = box.querySelectorAll('.ai-tabs__panel');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
        panels.forEach(function (pnl) {
          var show = pnl.dataset.panel === b.dataset.tab;
          pnl.hidden = !show;
          if (show && animate) gsap.fromTo(pnl, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' });
        });
      });
    });
  });

  /* ---------- AI pages: highlight the sub-nav link for the section in view ---------- */
  var subLinks = document.querySelectorAll('.ai-subnav a');
  function setCurrent(link) {
    subLinks.forEach(function (a) { a.setAttribute('aria-current', String(a === link)); });
  }
  subLinks.forEach(function (a) {
    var target = document.querySelector(a.getAttribute('href'));
    if (!target || !ScrollTrigger) return;
    ScrollTrigger.create({
      trigger: target,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: function (self) { if (self.isActive) setCurrent(a); }
    });
  });

  /* ---------- AI pages: interactive 3D dot field behind the hero ---------- */
  // A wide grid of dots seen in perspective that gently waves. While the pointer
  // is over the hero the grid tilts toward it, ripples around it and a soft glow
  // follows. Drawn on a canvas each GSAP tick; paused while the hero is off screen.
  // With reduced motion (or no GSAP) one still frame is drawn instead.
  var dotField = document.querySelector('.ai-hero__dots');
  var dotCanvas = dotField && document.createElement('canvas');
  var dotCtx = dotCanvas && dotCanvas.getContext('2d');
  if (dotCtx) {
    var dotHero = dotField.closest('.ai-hero') || dotField.parentNode;
    var FOCAL = 800;          // perspective strength
    var CAMERA = 350;         // camera distance from the grid
    var EXTENT = 1600;        // grid runs from -EXTENT to +EXTENT on both axes
    var RIPPLE = 450;         // ripple radius around the pointer (grid units)
    var BASE_TILT = Math.PI / 2.5;
    // brand cyan (121, 215, 227) brightening to white for dots lifted by the wave
    var SHADES = [];
    for (var s = 0; s <= 10; s++) {
      SHADES.push('rgb(' + Math.round(121 + 13.4 * s) + ',' + Math.round(215 + 4 * s) + ',' + Math.round(227 + 2.8 * s) + ')');
    }

    var grid = [], spacing = 0, fieldW = 0, fieldH = 0, dpr = 1;
    var clock = 0, tiltX = BASE_TILT, tiltY = 0, glow = 0;
    var pointer = { x: 0, y: 0, active: false };

    var buildGrid = function () {
      var next = window.innerWidth < 768 ? 75 : 40; // fewer dots on phones
      if (next === spacing) return;
      spacing = next;
      grid = [];
      for (var gx = -EXTENT; gx <= EXTENT; gx += spacing) {
        for (var gz = -EXTENT; gz <= EXTENT; gz += spacing) grid.push(gx, gz);
      }
    };

    var sizeField = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      fieldW = dotField.clientWidth;
      fieldH = dotField.clientHeight;
      dotCanvas.width = Math.round(fieldW * dpr);
      dotCanvas.height = Math.round(fieldH * dpr);
      buildGrid();
    };

    // step = frames elapsed at 60fps, so the motion speed is the same on any screen
    var drawField = function (step) {
      clock += 0.015 * step;
      var aimX, aimY;
      if (pointer.active) {
        aimY = (pointer.x / fieldW * 2 - 1) * Math.PI / 8;
        aimX = BASE_TILT - (pointer.y / fieldH * 2 - 1) * Math.PI / 10;
      } else {
        aimY = Math.sin(clock * 0.4) * Math.PI / 12;
        aimX = BASE_TILT + Math.cos(clock * 0.25) * Math.PI / 16;
      }
      var ease = 1 - Math.pow(0.95, step);
      tiltX += (aimX - tiltX) * ease;
      tiltY += (aimY - tiltY) * ease;
      glow += ((pointer.active ? 1 : 0) - glow) * (1 - Math.pow(0.9, step));

      var cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);
      var cosY = Math.cos(tiltY), sinY = Math.sin(tiltY);
      var mx = (pointer.x - fieldW / 2) * 1.5;   // pointer position on the grid
      var mz = -(pointer.y - fieldH / 2) * 2.8;

      dotCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dotCtx.clearRect(0, 0, fieldW, fieldH);

      if (glow > 0.01) {
        var halo = dotCtx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 400);
        halo.addColorStop(0, 'rgba(121, 215, 227, ' + 0.15 * glow + ')');
        halo.addColorStop(0.5, 'rgba(121, 215, 227, ' + 0.05 * glow + ')');
        halo.addColorStop(1, 'rgba(121, 215, 227, 0)');
        dotCtx.fillStyle = halo;
        dotCtx.fillRect(0, 0, fieldW, fieldH);
      }

      for (var i = 0; i < grid.length; i += 2) {
        var bx = grid[i], bz = grid[i + 1];
        var lift = Math.sin(bx * 0.003 + clock) * Math.cos(bz * 0.003 + clock) * 20;
        if (pointer.active) {
          var dist = Math.sqrt((bx - mx) * (bx - mx) + (bz - mz) * (bz - mz));
          if (dist < RIPPLE) lift += Math.sin(dist * 0.03 - clock * 2) * (1 - dist / RIPPLE) * 60;
        }
        // rotate around the vertical axis, then tilt, then project to the screen
        var x1 = bx * cosY - bz * sinY;
        var z1 = bz * cosY + bx * sinY;
        var y2 = lift * cosX - z1 * sinX;
        var z2 = z1 * cosX + lift * sinX;
        if (z2 + CAMERA < -FOCAL / 2) continue;
        var scale = FOCAL / (FOCAL + z2 + CAMERA);
        var alpha = Math.min(1, 1.8 * scale - 0.4);
        if (alpha <= 0) continue;
        var radius = Math.max(0.2, 2.5 * scale);
        var px = x1 * scale + fieldW / 2;
        var py = y2 * scale + fieldH / 2;
        if (px < -radius || px > fieldW + radius || py < -radius || py > fieldH + radius) continue;

        dotCtx.fillStyle = SHADES[lift > 0 ? Math.round(Math.min(1, lift / 40) * 10) : 0];
        dotCtx.globalAlpha = lift > 0 ? alpha : alpha * 0.7;
        dotCtx.beginPath();
        dotCtx.arc(px, py, radius, 0, 6.2832);
        dotCtx.fill();
      }
      dotCtx.globalAlpha = 1;
    };

    dotField.appendChild(dotCanvas);
    dotField.classList.add('is-live');
    sizeField();
    drawField(0); // first frame right away, before the first tick

    if (animate) {
      var fieldTick = function () { drawField(Math.min(gsap.ticker.deltaRatio(60), 3)); };
      var fieldRunning = false;
      var runField = function (on) {
        if (on === fieldRunning) return;
        fieldRunning = on;
        if (on) gsap.ticker.add(fieldTick); else gsap.ticker.remove(fieldTick);
      };
      ScrollTrigger.create({
        trigger: dotHero,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: function (self) { runField(self.isActive); }
      });
      runField(ScrollTrigger.isInViewport(dotHero));

      var aimAt = function (e) {
        var box = dotField.getBoundingClientRect();
        pointer.x = e.clientX - box.left;
        pointer.y = e.clientY - box.top;
        pointer.active = true;
      };
      var release = function () { pointer.active = false; };
      dotHero.addEventListener('pointermove', aimAt);
      dotHero.addEventListener('pointerdown', aimAt);
      dotHero.addEventListener('pointerleave', release);
      dotHero.addEventListener('pointercancel', release);
      dotHero.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') release(); });
      window.addEventListener('resize', sizeField);
    } else {
      window.addEventListener('resize', function () { sizeField(); drawField(0); });
    }
  }

  /* ---------- About page: endlessly scrolling photo strip ---------- */
  // The track holds the photos twice, so sliding it by half loops seamlessly.
  if (animate) {
    document.querySelectorAll('.photo-marquee__track').forEach(function (track) {
      var loop = gsap.to(track, { xPercent: -50, duration: 50, ease: 'none', repeat: -1 });
      track.addEventListener('mouseenter', function () { gsap.to(loop, { timeScale: 0.2, duration: 0.6 }); });
      track.addEventListener('mouseleave', function () { gsap.to(loop, { timeScale: 1, duration: 0.6 }); });
    });
  }

  /* ---------- Blog: topic filters + live search ---------- */
  var blogGrid = document.querySelector('[data-blog-grid]');
  if (blogGrid) {
    var blogCards = Array.prototype.slice.call(blogGrid.querySelectorAll('.blog-card'));
    var filterBtns = document.querySelectorAll('[data-filter]');
    var searchForm = document.querySelector('[data-blog-search]');
    var searchInput = searchForm.querySelector('input');
    var emptyMsg = document.querySelector('[data-blog-empty]');
    var activeCat = 'all';

    var applyBlogFilters = function () {
      var q = searchInput.value.trim().toLowerCase();
      var shown = 0;
      blogCards.forEach(function (card) {
        var match = (activeCat === 'all' || card.dataset.cat === activeCat) &&
          (!q || card.textContent.toLowerCase().indexOf(q) !== -1);
        card.hidden = !match;
        if (match) shown++;
      });
      emptyMsg.hidden = shown > 0;
      // Cards that just reappeared need their scroll-reveal positions recalculated.
      if (ScrollTrigger) ScrollTrigger.refresh();
    };

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeCat = btn.dataset.filter;
        filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        applyBlogFilters();
      });
    });
    searchInput.addEventListener('input', applyBlogFilters);
    searchForm.addEventListener('submit', function (e) { e.preventDefault(); applyBlogFilters(); });

    // Article pages link to "insights/?topic=ai" to open the list already filtered.
    var startTopic = new URLSearchParams(window.location.search).get('topic');
    filterBtns.forEach(function (btn) {
      if (startTopic && btn.dataset.filter === startTopic) btn.click();
    });
  }

  /* ---------- Blog: newsletter form ---------- */
  // Not connected to an email service yet. Before launch, send the address to your
  // provider (Mailchimp, ConvertKit, etc.) instead of only showing the thank-you note.
  var newsletter = document.querySelector('[data-newsletter]');
  if (newsletter) {
    var nlEmail = newsletter.querySelector('input');
    var nlNote = document.querySelector('[data-newsletter-note]');
    newsletter.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!nlEmail.value || !nlEmail.checkValidity()) {
        nlEmail.setAttribute('aria-invalid', 'true');
        nlNote.textContent = 'Please enter a valid email address.';
        nlEmail.focus();
        return;
      }
      nlEmail.removeAttribute('aria-invalid');
      nlNote.textContent = 'Thanks for signing up!';
      newsletter.reset();
    });
  }

  /* ---------- 404 page: the 4-0-4 face draws itself in, then blinks now and then ---------- */
  var nfFace = document.querySelector('.nf-face');
  if (nfFace && animate) {
    var faceStrokes = Array.prototype.slice.call(nfFace.querySelectorAll('path, rect'));
    var faceEyes = nfFace.querySelector('.nf-face__eyes');
    faceStrokes.forEach(function (el) {
      var length = el.getTotalLength();
      gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
    });
    gsap.timeline({ delay: 0.3 })
      .to(faceStrokes, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.18 })
      .add(function () {
        gsap.timeline({ repeat: -1, repeatDelay: 2.5 })
          .to(faceEyes, { x: -8, duration: 0.5, ease: 'power2.inOut' })
          .to(faceEyes, { x: 8, duration: 0.8, ease: 'power2.inOut' }, '+=0.6')
          .to(faceEyes, { x: 0, duration: 0.5, ease: 'power2.inOut' }, '+=0.6')
          .to(faceEyes, { scaleY: 0.1, transformOrigin: '50% 70%', duration: 0.1, ease: 'power1.in' }, '+=0.4')
          .to(faceEyes, { scaleY: 1, duration: 0.16, ease: 'power1.out' });
      });
  }

  /* ---------- Contact form: stored in a Google Form ---------- */
  // The form's action is the Google Form's formResponse URL and each field is named after
  // its question ID (see contact/index.html). After checking the fields we send them in the
  // background, then open the thank-you page from data-thanks. Google does not let other
  // sites read its reply, so a sent request is treated as delivered.
  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    var contactStatus = contactForm.querySelector('[data-contact-status]');
    var contactSubmit = contactForm.querySelector('[type="submit"]');
    var thanksUrl = contactForm.getAttribute('data-thanks');
    var contactMessages = {
      cfName: 'Please enter your name.',
      cfEmail: 'Please enter a valid email address.',
      cfPhone: 'Please enter a phone number we can reach you on.'
    };
    var requiredFields = Array.prototype.slice.call(contactForm.querySelectorAll('[required]'));
    var checkField = function (input) {
      var ok = input.value.trim() !== '' && input.checkValidity();
      var err = document.getElementById(input.getAttribute('aria-describedby'));
      input.setAttribute('aria-invalid', String(!ok));
      if (err) err.textContent = ok ? '' : contactMessages[input.id];
      return ok;
    };
    var setSending = function (sending) {
      contactSubmit.disabled = sending;
      contactSubmit.textContent = sending ? 'Sending...' : 'Send';
    };

    requiredFields.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) checkField(input); });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') checkField(input);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactStatus.hidden = true;
      // Spam trap was filled in: skip sending but behave as if it worked.
      if (contactForm.elements.website.value) { window.location.href = thanksUrl; return; }

      var firstBad = null;
      requiredFields.forEach(function (input) {
        if (!checkField(input) && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }

      var data = new URLSearchParams(new FormData(contactForm));
      data.delete('website');
      var timeout = new AbortController();
      var timer = setTimeout(function () { timeout.abort(); }, 15000);

      setSending(true);
      fetch(contactForm.action, { method: 'POST', mode: 'no-cors', body: data, signal: timeout.signal })
        .then(function () {
          window.location.href = thanksUrl;
        })
        .catch(function () {
          setSending(false);
          contactStatus.textContent = 'Sorry, your message could not be sent. Please check your connection and try again.';
          contactStatus.hidden = false;
        })
        .finally(function () { clearTimeout(timer); });
    });
  }

  /* Footer (including the copyright year) is built by js/footer.js. */
})();
