/*!
 * NEHA EDU LABS — notes.js
 * Renders semester/subject-wise notes tables from data/notes.json.
 */
var NELNotes = (function () {
  "use strict";

  function typeBadge(type) {
    var map = { "Notes": "badge-primary", "Lab Manual": "badge-accent", "Question Paper": "badge-warning", "Formula Sheet": "badge-secondary", "Assignment": "badge-success" };
    return map[type] || "badge-neutral";
  }

  function render(containerId, opts) {
    var container = document.getElementById(containerId);
    if (!container) return;
    opts = opts || {};
    NELData.load("data/notes.json").then(function (items) {
      var filtered = items.slice();
      if (opts.semester) filtered = filtered.filter(function (n) { return n.semester === opts.semester; });
      if (opts.subject) filtered = filtered.filter(function (n) { return n.subject === opts.subject; });
      if (opts.search) {
        var q = opts.search.toLowerCase();
        filtered = filtered.filter(function (n) { return (n.title + n.subject).toLowerCase().indexOf(q) > -1; });
      }

      var groups = {};
      filtered.forEach(function (n) {
        groups[n.subject] = groups[n.subject] || [];
        groups[n.subject].push(n);
      });

      var html = Object.keys(groups).map(function (subject) {
        var rows = groups[subject].map(function (n) {
          return (
            '<tr><td>' + NELData.escapeHtml(n.unit) + '</td><td>' + NELData.escapeHtml(n.title) + '</td>' +
            '<td><span class="badge ' + typeBadge(n.type) + '">' + n.type + '</span></td><td>' + n.size + '</td>' +
            '<td><a href="' + n.fileUrl + '" class="btn btn-sm btn-outline"><i class="fa-solid fa-download"></i> Download</a></td></tr>'
          );
        }).join("");
        return (
          '<div class="mb-4" data-aos="fade-up">' +
            '<h3 class="mb-2"><i class="fa-solid fa-book"></i> ' + NELData.escapeHtml(subject) + ' <span class="badge badge-neutral">' + groups[subject][0].semester + '</span></h3>' +
            '<div class="table-wrap"><table class="data-table"><thead><tr><th>Unit</th><th>Title</th><th>Type</th><th>Size</th><th>Download</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
          '</div>'
        );
      }).join("");

      container.innerHTML = html || '<p class="text-muted text-center">No notes match your search.</p>';
      if (window.AOS) AOS.refresh();
    });
  }

  return { render: render };
})();
