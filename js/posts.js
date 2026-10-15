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
    ['is-ai-describing-your-business-correctly', 'Is AI Describing Your Business Correctly? A Practical Checklist for 2027', 'ai', 'Alex Rivera', 'October 8, 2026', 'How to check what AI assistants say about you, correct mistakes and give them trustworthy information.'],
    ['ai-assistants-local-search', 'How AI Assistants Are Changing Local Search Results', 'ai', 'Jordan Rivera', 'September 24, 2026', 'More customers ask AI tools for recommendations. Here is how local businesses can stay visible.'],
    ['privacy-friendly-website-leads', 'Building a Privacy-Friendly Website That Still Generates Leads', 'design', 'Sam Patel', 'September 10, 2026', 'Forms, analytics and follow-up that respect privacy and still bring in qualified leads.'],
    ['self-updating-websites-ai', 'Self-Updating Websites: Keeping Content Fresh With AI', 'ai', 'Sam Patel', 'August 28, 2026', 'Automated content checks keep opening hours, prices and service details accurate.'],
    ['portfolio-readable-people-machines', 'Making Your Portfolio Readable by People and Machines', 'design', 'Taylor Kim', 'August 19, 2026', 'A few structural changes help visitors and AI tools understand your work.'],
    ['original-insights-beat-generic-content', 'Why Original Insights Beat Generic Content', 'marketing', 'Alex Rivera', 'August 6, 2026', 'Turn your team\'s expertise into articles worth reading, linking to and citing.'],
    ['structuring-data-ai-search', 'Structuring Your Data for AI-Powered Search', 'ai', 'Marcus Lee', 'July 23, 2026', 'Clean, consistent product and location data makes you easier to recommend.'],
    ['online-searches-into-foot-traffic', 'Turning Online Searches Into Foot Traffic', 'marketing', 'Jordan Rivera', 'July 9, 2026', 'Business profiles, reviews and location pages that bring nearby customers through the door.'],
    ['website-talking-to-machines', 'Your Website Is Talking to Machines, Too', 'strategy', 'Priya Shah', 'June 25, 2026', 'What AI crawlers look for and how to give them an accurate picture of your business.'],
    ['website-invisible-new-customers', 'Is Your Website Invisible to New Customers?', 'design', 'Taylor Kim', 'June 12, 2026', 'Quick checks for the slow pages, thin content and technical gaps that hide a great business.'],
    ['topic-clusters-content-that-ranks', 'Topic Clusters: Organizing Content That Ranks', 'marketing', 'Sam Patel', 'May 30, 2026', 'Group related pages around core topics so people and search engines can follow along.'],
    ['seo-for-professional-services', 'Going Beyond Basic SEO for Professional Services', 'marketing', 'Alex Rivera', 'May 14, 2026', 'How law firms and consultants can stand out in crowded, competitive searches.'],
    ['multi-location-website', 'Planning a Multi-Location Website That Scales', 'strategy', 'Marcus Lee', 'April 30, 2026', 'Structure a site for several branches without duplicating work.'],
    ['b2b-product-pages-leads', 'Product Pages That Turn B2B Buyers Into Leads', 'ecommerce', 'Jordan Rivera', 'April 16, 2026', 'Answer real buyer questions and make requesting a quote effortless.'],
    ['automating-faq-markup', 'Automating FAQ Markup Without Writing Code', 'development', 'Sam Patel', 'April 2, 2026', 'Turn the questions you already answer into rich search results.'],
    ['spreadsheets-custom-app', 'When Spreadsheets Stop Scaling: Signs You Need a Custom App', 'development', 'Marcus Lee', 'March 19, 2026', 'Warning signs that a purpose-built tool will quickly pay for itself.'],
    ['click-and-collect-local-shops', 'Click-and-Collect: Helping Local Shops Compete Online', 'ecommerce', 'Taylor Kim', 'March 5, 2026', 'What it takes to set up buy online, pick up in store the right way.']
  ];

  function initials(name) {
    return name.split(' ').map(function (w) { return w.charAt(0); }).join('');
  }

  function card(p) {
    return '<a href="' + ROOT + 'insights/' + p[0] + '/" class="post reveal">' +
      '<span class="post__meta"><i class="post__avatar">' + initials(p[3]) + '</i>' +
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
