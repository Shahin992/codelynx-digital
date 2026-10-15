/* Shared list of Insights articles.
   Builds the "Related Insights" cards at the bottom of every article page.
   When you publish a new article, add it to the top of POSTS (newest first).

   Each article page provides (the same data-root used by js/nav.js):
     <div data-related="this-article-slug"></div>
     <script src="../../js/posts.js"></script>   (before js/main.js) */
(function () {
  'use strict';

  var ROOT = document.documentElement.getAttribute('data-root') || '';
  var RELATED_COUNT = 3;

  // [slug, title, topic, author, date, short summary]
  // The slug is the folder name inside /insights/.
  var POSTS = [
    ['is-ai-describing-your-business-correctly', 'Is AI Describing Your Business Correctly? A Practical Checklist for 2027', 'ai', 'Alex Rivera', 'October 8, 2026', 'AI assistants now answer questions about your company before customers ever reach your website, and they do not always get it right. This practical checklist shows you how to audit what they say, fix mistakes at the source and give them clear, trustworthy information to repeat.'],
    ['ai-assistants-local-search', 'How AI Assistants Are Changing Local Search Results', 'ai', 'Jordan Rivera', 'September 24, 2026', 'More customers now ask AI assistants for local recommendations instead of scrolling through search results. Learn what is actually changing, what these tools seem to look for in a local business and the practical steps that keep you on the shortlist when someone nearby asks for help.'],
    ['privacy-friendly-website-leads', 'Building a Privacy-Friendly Website That Still Generates Leads', 'design', 'Sam Patel', 'September 10, 2026', 'Third-party cookies are losing their reach and visitors are more careful about their data. Learn how to design forms, analytics and follow-up that respect privacy, build trust and still bring in a steady flow of qualified leads for your business, without relying on invasive tracking.'],
    ['self-updating-websites-ai', 'Self-Updating Websites: Keeping Content Fresh With AI', 'ai', 'Sam Patel', 'August 28, 2026', 'Outdated hours, old prices and discontinued services quietly erode trust and confuse search engines and AI assistants. Learn how automated content checks and a single source of truth keep your website accurate, while your team stays firmly in charge of every change that goes live.'],
    ['portfolio-readable-people-machines', 'Making Your Portfolio Readable by People and Machines', 'design', 'Taylor Kim', 'August 19, 2026', 'Minimal portfolios look stunning, yet they often leave visitors and AI tools guessing about what you actually did. Learn how a simple project structure, better page details and smart internal links help your best work get found, understood and recommended without cluttering the design.'],
    ['original-insights-beat-generic-content', 'Why Original Insights Beat Generic Content', 'marketing', 'Alex Rivera', 'August 6, 2026', 'AI tools can produce generic articles in seconds, so content that repeats what everyone else says has lost its value. Learn what original insight really means for a business, why search engines and AI assistants favor it and how to turn your team\'s everyday expertise into articles worth citing.'],
    ['structuring-data-ai-search', 'Structuring Your Data for AI-Powered Search', 'ai', 'Marcus Lee', 'July 23, 2026', 'AI assistants recommend businesses and products they can clearly understand. This practical guide explains what structured data really means, how to clean up product and location details, where schema markup fits and why consistency across directories and marketplaces matters as much as your own website.'],
    ['online-searches-into-foot-traffic', 'Turning Online Searches Into Foot Traffic', 'marketing', 'Jordan Rivera', 'July 9, 2026', 'Many store visits begin with a quick search on a phone, often minutes before someone decides where to go. This playbook shows how to strengthen your business profile, earn and use reviews, build helpful location pages and remove friction so more nearby searchers walk through your door.'],
    ['website-talking-to-machines', 'Your Website Is Talking to Machines, Too', 'strategy', 'Priya Shah', 'June 25, 2026', 'Your website is read by search crawlers, AI assistants and automated tools long before many customers visit it. Learn who these machine visitors are, what they look for, and the practical steps that help them come away with an accurate, consistent picture of your business and what you offer.'],
    ['website-invisible-new-customers', 'Is Your Website Invisible to New Customers?', 'design', 'Taylor Kim', 'June 12, 2026', 'A great business can still be almost impossible to find online. Slow mobile pages, vague headlines, hidden pages and thin content quietly keep new customers away. Work through these practical checks to spot the gaps, fix the easy wins and make sure the right people can actually find you.'],
    ['topic-clusters-content-that-ranks', 'Topic Clusters: Organizing Content That Ranks', 'marketing', 'Sam Patel', 'May 30, 2026', 'Publishing more articles does not automatically build authority. Topic clusters group related pages around a core subject, linking a broad pillar page to focused supporting articles. Learn how clusters work, why they help search engines and readers, and how to plan, write and maintain your first one step by step.'],
    ['seo-for-professional-services', 'Going Beyond Basic SEO for Professional Services', 'marketing', 'Alex Rivera', 'May 14, 2026', 'Law firms, accountants and consultants compete in some of the most crowded search results online. Basic SEO is rarely enough. Learn how dedicated practice-area pages, visible expertise, strong local signals, structured data and an effortless contact process help professional firms earn trust and win more qualified inquiries.'],
    ['multi-location-website', 'Planning a Multi-Location Website That Scales', 'strategy', 'Marcus Lee', 'April 30, 2026', 'Adding branches should not mean multiplying website headaches. This guide shows how to plan a multi-location site with strong location pages, shared content that stays consistent, a simple branch finder and a repeatable template, so every new location launches quickly and customers always reach the right team.'],
    ['b2b-product-pages-leads', 'Product Pages That Turn B2B Buyers Into Leads', 'ecommerce', 'Jordan Rivera', 'April 16, 2026', 'Dense spec sheets and buried PDFs rarely persuade a B2B buyer to get in touch. Learn how to build product pages that explain what each product solves, present specifications clearly, answer the questions that decide a purchase and make requesting a quote quick and painless for busy buyers.'],
    ['automating-faq-markup', 'Automating FAQ Markup Without Writing Code', 'development', 'Sam Patel', 'April 2, 2026', 'Your team already answers the same customer questions every week. This guide shows how to turn those answers into clear FAQ sections with structured data, using the tools in your content editor instead of code, and how to build a simple routine that keeps every answer accurate as your business changes.'],
    ['spreadsheets-custom-app', 'When Spreadsheets Stop Scaling: Signs You Need a Custom App', 'development', 'Marcus Lee', 'March 19, 2026', 'Spreadsheets are a brilliant way to start, but many growing businesses end up running critical work on fragile shared files. Learn the warning signs that a spreadsheet has hit its limit, what a custom web app does differently and how to replace one painful process at a time.'],
    ['click-and-collect-local-shops', 'Click-and-Collect: Helping Local Shops Compete Online', 'ecommerce', 'Taylor Kim', 'March 5, 2026', 'Buy online, pick up in store lets independent retailers offer the convenience of online shopping with the speed of a local shop. Learn why customers like it, how it brings people through your door and what it takes to set up accurate stock, a clear checkout and a smooth hand-off.']
  ];

  // Initials badge in place of an author photo.
  function avatar(name) {
    var initials = name.split(' ').map(function (w) { return w.charAt(0); }).join('');
    return '<span class="post__avatar" aria-hidden="true">' + initials + '</span>';
  }

  function card(p) {
    return '<a href="' + ROOT + 'insights/' + p[0] + '/" class="post reveal">' +
      '<span class="post__meta">' + avatar(p[3]) +
        '<span class="post__author">' + p[3] + '</span><span class="post__date">' + p[4] + '</span></span>' +
      '<h3>' + p[1] + '</h3>' +
      '<p>' + p[5] + '</p>' +
    '</a>';
  }

  var mount = document.querySelector('[data-related]');
  if (!mount) return;

  var slug = mount.getAttribute('data-related');
  var current = POSTS.filter(function (p) { return p[0] === slug; })[0];
  var others = POSTS.filter(function (p) { return p[0] !== slug; });

  // Same topic first, then the newest articles from other topics.
  var related = current ? others.filter(function (p) { return p[2] === current[2]; }) : [];
  others.forEach(function (p) {
    if (related.indexOf(p) === -1) related.push(p);
  });

  mount.innerHTML = related.slice(0, RELATED_COUNT).map(card).join('');
})();
