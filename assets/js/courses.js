/*!
 * NEHA EDU LABS — courses.js
 * Renders course card grids (with category filtering) from data/courses.json.
 */
var NELCourses = (function () {
  "use strict";

  function stars(rating) {
    var full = Math.round(rating);
    var out = "";
    for (var i = 0; i < 5; i++) out += '<i class="fa-solid fa-star" style="' + (i < full ? "" : "opacity:.25") + '"></i>';
    return out;
  }

  function cardTemplate(c) {
    return (
      '<article class="card" data-category="' + c.category + '" data-aos="fade-up">' +
        '<div class="card__media"><span class="category-pill">' + c.categoryLabel + '</span><img src="' + c.image + '" alt="' + NELData.escapeHtml(c.title) + ' course illustration" loading="lazy" width="200" height="200"></div>' +
        '<div class="card__body">' +
          '<div class="card__meta"><span class="badge badge-neutral">' + c.level + '</span><span><i class="fa-regular fa-clock"></i> ' + c.duration + '</span><span><i class="fa-solid fa-list-check"></i> ' + c.lessons + ' lessons</span></div>' +
          '<h3 class="card__title"><a href="course-detail.html?id=' + c.id + '">' + NELData.escapeHtml(c.title) + '</a></h3>' +
          '<p class="card__desc">' + NELData.escapeHtml(c.description) + '</p>' +
        '</div>' +
        '<div class="card__footer"><span>' + stars(c.rating) + ' <strong>' + c.rating + '</strong></span><span class="text-muted">' + c.students.toLocaleString() + ' students</span></div>' +
      '</article>'
    );
  }

  function renderGrid(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return Promise.resolve([]);
    opts = opts || {};
    return NELData.load("data/courses.json").then(function (items) {
      var filtered = opts.category ? items.filter(function (c) { return c.category === opts.category; }) : items;
      if (opts.limit) filtered = filtered.slice(0, opts.limit);
      container.innerHTML = filtered.length
        ? filtered.map(cardTemplate).join("")
        : '<p class="text-muted text-center">No courses found in this category yet.</p>';
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

  function renderDetail(containerId) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    NELData.load("data/courses.json").then(function (items) {
      var course = items.find(function (c) { return c.id === id; }) || items[0];
      if (!course) { container.innerHTML = "<p>Course not found.</p>"; return; }
      document.title = course.title + " | Neha Edu Labs";
      var descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) descMeta.setAttribute("content", course.description);

      container.innerHTML =
        '<div class="page-hero">' +
          '<div class="container">' +
            '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><i class="fa-solid fa-chevron-right" style="font-size:.6em;"></i><a href="courses.html">Courses</a><i class="fa-solid fa-chevron-right" style="font-size:.6em;"></i><span>' + NELData.escapeHtml(course.title) + '</span></nav>' +
            '<span class="badge badge-primary mt-2">' + course.categoryLabel + '</span>' +
            '<h1>' + NELData.escapeHtml(course.title) + '</h1>' +
            '<p>' + NELData.escapeHtml(course.description) + '</p>' +
            '<div class="flex gap-md mt-3" style="flex-wrap:wrap;">' +
              '<span class="badge badge-neutral">' + course.level + '</span>' +
              '<span class="badge badge-neutral"><i class="fa-regular fa-clock"></i> ' + course.duration + '</span>' +
              '<span class="badge badge-neutral"><i class="fa-solid fa-list-check"></i> ' + course.lessons + ' lessons</span>' +
              '<span class="badge badge-neutral"><i class="fa-solid fa-star" style="color:#F59E0B;"></i> ' + course.rating + ' (' + course.students.toLocaleString() + ' students)</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="section">' +
          '<div class="container">' +
          '<div class="grid" style="grid-template-columns: 2fr 1fr; gap:3rem;">' +
            '<div>' +
              '<h2 class="mb-2">Overview</h2><p class="mb-4">' + NELData.escapeHtml(course.overview) + '</p>' +
              '<h2 class="mb-2">Roadmap</h2><ul class="mb-4" style="list-style:none;">' + course.roadmap.map(function (r) { return '<li class="mb-1"><i class="fa-solid fa-circle-check" style="color:var(--color-success);"></i> ' + NELData.escapeHtml(r) + '</li>'; }).join("") + '</ul>' +
              '<h2 class="mb-2">Syllabus</h2>' + course.syllabus.map(function (m) {
                return '<div class="accordion-item"><button class="accordion-header">' + NELData.escapeHtml(m.module) + ' <i class="fa-solid fa-chevron-down"></i></button><div class="accordion-panel"><div class="accordion-panel-inner"><ul>' + m.topics.map(function (t) { return '<li class="mb-1">&bull; ' + NELData.escapeHtml(t) + '</li>'; }).join("") + '</ul></div></div></div>';
              }).join("") +
              '<h2 class="mt-4 mb-2">FAQs</h2>' + course.faqs.map(function (f) {
                return '<div class="accordion-item"><button class="accordion-header">' + NELData.escapeHtml(f.q) + ' <i class="fa-solid fa-chevron-down"></i></button><div class="accordion-panel"><div class="accordion-panel-inner">' + NELData.escapeHtml(f.a) + '</div></div></div>';
              }).join("") +
            '</div>' +
            '<aside>' +
              '<div class="card" style="padding:1.5rem;">' +
                '<img src="' + course.image + '" alt="" class="mb-3" style="border-radius:var(--radius-md);">' +
                '<h3 class="mb-2">Downloads</h3>' +
                '<ul style="list-style:none;">' + course.downloads.map(function (d) { return '<li class="mb-2"><a class="btn btn-outline btn-block btn-sm" href="' + d.url + '"><i class="fa-solid fa-download"></i> ' + NELData.escapeHtml(d.title) + '</a></li>'; }).join("") + '</ul>' +
                '<p class="text-muted mt-3" style="font-size:.85rem;"><i class="fa-solid fa-chalkboard-user"></i> Instructor: <strong>' + NELData.escapeHtml(course.instructor) + '</strong></p>' +
                '<a href="contact.html" class="btn btn-primary btn-block mt-3">Enroll Interest</a>' +
              '</div>' +
            '</aside>' +
          '</div>' +
          '</div>' +
        '</div>';
    });
  }

  return { renderGrid: renderGrid, initFilters: initFilters, renderDetail: renderDetail };
})();
