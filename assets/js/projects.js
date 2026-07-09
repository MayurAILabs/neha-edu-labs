/*!
 * NEHA EDU LABS — projects.js
 * Renders project card grids (with category filtering) from data/projects.json.
 */
var NELProjects = (function () {
  "use strict";

  function diffClass(d) {
    return d === "Beginner" ? "badge-success" : d === "Intermediate" ? "badge-warning" : "badge-danger";
  }

  function cardTemplate(p) {
    return (
      '<article class="card" data-category="' + p.category + '" data-aos="fade-up">' +
        '<div class="card__media"><span class="category-pill">' + NELData.escapeHtml(p.categoryLabel) + '</span><img src="' + p.image + '" alt="" loading="lazy" width="200" height="200"></div>' +
        '<div class="card__body">' +
          '<div class="card__meta"><span class="badge ' + diffClass(p.difficulty) + '">' + p.difficulty + '</span></div>' +
          '<h3 class="card__title">' + NELData.escapeHtml(p.title) + '</h3>' +
          '<p class="card__desc">' + NELData.escapeHtml(p.description) + '</p>' +
          '<div class="flex gap-sm" style="flex-wrap:wrap;">' + p.tech.map(function (t) { return '<span class="badge badge-neutral">' + NELData.escapeHtml(t) + '</span>'; }).join("") + '</div>' +
        '</div>' +
        '<div class="card__footer">' +
          '<a href="' + p.github + '" target="_blank" rel="noopener" class="btn btn-outline btn-sm"><i class="fa-brands fa-github"></i> Code</a>' +
          '<a href="' + p.demo + '" class="text-muted" style="font-size:.85rem;">View details <i class="fa-solid fa-arrow-right"></i></a>' +
        '</div>' +
      '</article>'
    );
  }

  function renderGrid(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return Promise.resolve([]);
    opts = opts || {};
    return NELData.load("data/projects.json").then(function (items) {
      var filtered = opts.category ? items.filter(function (p) { return p.category === opts.category; }) : items;
      if (opts.limit) filtered = filtered.slice(0, opts.limit);
      container.innerHTML = filtered.length ? filtered.map(cardTemplate).join("") : '<p class="text-muted text-center">No projects in this category yet.</p>';
      if (window.AOS) AOS.refresh();
      return items;
    });
  }

  function initFilters(containerId, tabsId) {
    var tabs = document.getElementById(tabsId);
    if (!tabs) return;
    tabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-tab");
      if (!btn) return;
      tabs.querySelectorAll(".filter-tab").forEach(function (t) { t.classList.remove("active"); });
      btn.classList.add("active");
      var cat = btn.getAttribute("data-filter");
      renderGrid(containerId, cat === "all" ? {} : { category: cat });
    });

    var hash = window.location.hash.replace("#", "");
    var target = hash && tabs.querySelector('.filter-tab[data-filter="' + hash + '"]');
    if (target) {
      tabs.querySelectorAll(".filter-tab").forEach(function (t) { t.classList.remove("active"); });
      target.classList.add("active");
      renderGrid(containerId, { category: hash });
    } else {
      renderGrid(containerId, {});
    }
  }

  return { renderGrid: renderGrid, initFilters: initFilters };
})();
