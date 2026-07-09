/*!
 * NEHA EDU LABS — blog.js
 * Renders blog card grids and full article view from data/blog.json.
 */
var NELBlog = (function () {
  "use strict";

  function cardTemplate(p) {
    return (
      '<article class="card" data-category="' + NELData.escapeHtml(p.category) + '" data-aos="fade-up">' +
        '<div class="card__media"><span class="category-pill">' + NELData.escapeHtml(p.category) + '</span><img src="' + p.image + '" alt="" loading="lazy" width="200" height="200"></div>' +
        '<div class="card__body">' +
          '<div class="card__meta"><i class="fa-regular fa-calendar"></i> ' + NELData.formatDate(p.date) + ' &middot; <i class="fa-regular fa-clock"></i> ' + p.readTime + ' min read</div>' +
          '<h3 class="card__title"><a href="blog-post.html?id=' + p.id + '">' + NELData.escapeHtml(p.title) + '</a></h3>' +
          '<p class="card__desc">' + NELData.escapeHtml(p.excerpt) + '</p>' +
        '</div>' +
        '<div class="card__footer"><span><i class="fa-solid fa-user"></i> ' + NELData.escapeHtml(p.author) + '</span><span class="text-muted">Read more <i class="fa-solid fa-arrow-right"></i></span></div>' +
      '</article>'
    );
  }

  function renderGrid(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return Promise.resolve([]);
    opts = opts || {};
    return NELData.load("data/blog.json").then(function (items) {
      var filtered = items.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      if (opts.category) filtered = filtered.filter(function (p) { return p.category === opts.category; });
      if (opts.limit) filtered = filtered.slice(0, opts.limit);
      container.innerHTML = filtered.length ? filtered.map(cardTemplate).join("") : '<p class="text-muted text-center">No articles yet.</p>';
      if (window.AOS) AOS.refresh();
      return items;
    });
  }

  function renderPost(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    NELData.load("data/blog.json").then(function (items) {
      var post = items.find(function (p) { return p.id === id; }) || items[0];
      if (!post) { container.innerHTML = "<p>Article not found.</p>"; return; }
      document.title = post.title + " | Neha Edu Labs Blog";
      var descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) descMeta.setAttribute("content", post.excerpt);

      var paragraphs = post.content.split("\n\n").map(function (para) { return "<p>" + NELData.escapeHtml(para) + "</p>"; }).join("");
      container.innerHTML =
        '<div class="page-hero">' +
          '<div class="container">' +
            '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><i class="fa-solid fa-chevron-right" style="font-size:.6em;"></i><a href="blog.html">Blog</a><i class="fa-solid fa-chevron-right" style="font-size:.6em;"></i><span>' + NELData.escapeHtml(post.title) + '</span></nav>' +
            '<span class="badge badge-primary mt-2">' + NELData.escapeHtml(post.category) + '</span>' +
            '<h1>' + NELData.escapeHtml(post.title) + '</h1>' +
            '<div class="flex gap-md text-muted mt-2" style="flex-wrap:wrap;font-size:.9rem;"><span><i class="fa-solid fa-user"></i> ' + NELData.escapeHtml(post.author) + '</span><span><i class="fa-regular fa-calendar"></i> ' + NELData.formatDate(post.date) + '</span><span><i class="fa-regular fa-clock"></i> ' + post.readTime + ' min read</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="section section-tight"><div class="container" style="max-width:800px;">' +
          '<img src="' + post.image + '" alt="" style="border-radius:var(--radius-lg);margin-bottom:2rem;">' +
          '<div style="font-size:1.05rem;line-height:1.9;" class="mb-4">' + paragraphs + '</div>' +
          '<div class="flex gap-sm mb-4" style="flex-wrap:wrap;">' + post.tags.map(function (t) { return '<span class="badge badge-neutral">#' + NELData.escapeHtml(t) + '</span>'; }).join("") + '</div>' +
          '<a href="blog.html" class="btn btn-outline"><i class="fa-solid fa-arrow-left"></i> Back to Blog</a>' +
        '</div></div>';
    });
  }

  return { renderGrid: renderGrid, renderPost: renderPost };
})();
