/*!
 * NEHA EDU LABS — search.js
 * Builds a lightweight combined search index across courses, notes, blog and
 * projects, and powers the global search overlay (Ctrl/Cmd+K) from components.js.
 */
var NELSearch = (function () {
  "use strict";

  var index = null;

  function buildIndex() {
    if (index) return index;
    index = Promise.all([
      NELData.load("data/courses.json"),
      NELData.load("data/blog.json"),
      NELData.load("data/projects.json"),
      NELData.load("data/notes.json")
    ]).then(function (results) {
      var courses = results[0].map(function (c) {
        return { title: c.title, desc: c.description, url: "course-detail.html?id=" + c.id, type: "Course", icon: "fa-graduation-cap" };
      });
      var blog = results[1].map(function (p) {
        return { title: p.title, desc: p.excerpt, url: "blog-post.html?id=" + p.id, type: "Blog", icon: "fa-newspaper" };
      });
      var projects = results[2].map(function (p) {
        return { title: p.title, desc: p.description, url: "projects.html", type: "Project", icon: "fa-diagram-project" };
      });
      var notes = results[3].map(function (n) {
        return { title: n.title, desc: n.subject + " — " + n.semester, url: "notes.html", type: "Notes", icon: "fa-book" };
      });
      return courses.concat(blog, projects, notes);
    });
    return index;
  }

  function render(query) {
    var resultsEl = document.getElementById("searchResults");
    if (!resultsEl) return;
    if (!query || query.trim().length < 2) {
      resultsEl.innerHTML = '<p class="search-empty">Start typing to search the entire site.</p>';
      return;
    }
    buildIndex().then(function (items) {
      var q = query.toLowerCase();
      var matches = items.filter(function (it) {
        return it.title.toLowerCase().indexOf(q) > -1 || it.desc.toLowerCase().indexOf(q) > -1;
      }).slice(0, 12);

      resultsEl.innerHTML = matches.length
        ? matches.map(function (m) {
            return '<a href="' + m.url + '"><span><i class="fa-solid ' + m.icon + '"></i> <strong>' + NELData.escapeHtml(m.title) + '</strong> <span class="badge badge-neutral">' + m.type + '</span></span><small>' + NELData.escapeHtml(m.desc) + '</small></a>';
          }).join("")
        : '<p class="search-empty">No results for &ldquo;' + NELData.escapeHtml(query) + '&rdquo;.</p>';
    });
  }

  document.addEventListener("DOMContentLoaded", function () { buildIndex(); });

  return { render: render, buildIndex: buildIndex };
})();
