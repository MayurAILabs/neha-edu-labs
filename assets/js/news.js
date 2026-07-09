/*!
 * NEHA EDU LABS — news.js
 * Renders the breaking news ticker and news card grids from data/news.json.
 * The ticker is auto-populated on every page once header partials are injected.
 */
var NELNews = (function () {
  "use strict";

  function tagClass(category) {
    var map = { AI: "ai", Education: "edu", Programming: "programming", Engineering: "engineering" };
    return map[category] || "edu";
  }

  function renderTicker() {
    var track = document.getElementById("ticker-track");
    if (!track) return;
    NELData.load("data/news.json").then(function (items) {
      if (!items.length) return;
      var sorted = items.slice().sort(function (a, b) { return new Date(b.publishedAt) - new Date(a.publishedAt); });
      var html = sorted.map(function (n) {
        return (
          '<a class="news-ticker__item" href="' + n.url + '" target="_blank" rel="noopener">' +
            '<span class="news-ticker__tag ' + tagClass(n.category) + '">' + n.category + '</span>' +
            NELData.escapeHtml(n.title) +
          '</a>'
        );
      }).join("");
      // duplicate content for seamless infinite scroll
      track.innerHTML = html + html;
    });
  }

  function cardTemplate(n) {
    return (
      '<article class="card" data-aos="fade-up">' +
        '<div class="card__media"><span class="category-pill">' + n.category + '</span><img src="' + n.image + '" alt="" loading="lazy" width="200" height="200"></div>' +
        '<div class="card__body">' +
          '<div class="card__meta"><i class="fa-regular fa-clock"></i> ' + NELData.timeAgo(n.publishedAt) + ' &middot; <span>' + NELData.escapeHtml(n.source) + '</span></div>' +
          '<h3 class="card__title"><a href="' + n.url + '" target="_blank" rel="noopener">' + NELData.escapeHtml(n.title) + '</a></h3>' +
          '<p class="card__desc">' + NELData.escapeHtml(n.summary) + '</p>' +
        '</div>' +
        '<div class="card__footer"><span class="badge badge-primary">' + n.category + '</span><span>' + NELData.formatDate(n.publishedAt) + '</span></div>' +
      '</article>'
    );
  }

  function renderCards(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;
    opts = opts || {};
    NELData.load("data/news.json").then(function (items) {
      var filtered = items.filter(function (n) { return !opts.category || n.category === opts.category; });
      filtered.sort(function (a, b) { return new Date(b.publishedAt) - new Date(a.publishedAt); });
      if (opts.limit) filtered = filtered.slice(0, opts.limit);
      container.innerHTML = filtered.length
        ? filtered.map(cardTemplate).join("")
        : '<p class="text-muted text-center">No news available right now. Please check back soon.</p>';
      if (window.AOS) AOS.refresh();
    });
  }

  document.addEventListener("nel:partials-ready", renderTicker);

  return { renderCards: renderCards, renderTicker: renderTicker };
})();
