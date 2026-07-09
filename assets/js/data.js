/*!
 * NEHA EDU LABS — data.js
 * Tiny fetch helper + formatting utilities shared by all JSON-driven render scripts.
 */
var NELData = (function () {
  "use strict";

  var cache = {};

  function load(path) {
    if (cache[path]) return cache[path];
    cache[path] = fetch(path, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + path);
        return res.json();
      })
      .catch(function (err) {
        console.warn("[NELData]", err.message);
        return [];
      });
    return cache[path];
  }

  function timeAgo(dateStr) {
    var date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    var seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    var map = [
      [31536000, "year"], [2592000, "month"], [86400, "day"],
      [3600, "hour"], [60, "minute"]
    ];
    for (var i = 0; i < map.length; i++) {
      var interval = Math.floor(seconds / map[i][0]);
      if (interval >= 1) return interval + " " + map[i][1] + (interval > 1 ? "s" : "") + " ago";
    }
    return "Just now";
  }

  function formatDate(dateStr) {
    var date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  return { load: load, timeAgo: timeAgo, formatDate: formatDate, escapeHtml: escapeHtml };
})();
