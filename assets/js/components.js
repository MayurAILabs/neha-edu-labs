/*!
 * NEHA EDU LABS — components.js
 * Injects shared header (news ticker + navbar) and footer into every page,
 * plus dark mode, mobile nav, dropdowns and the search overlay.
 * Include on every page via: <script src="assets/js/components.js" defer></script>
 * Requires: <div id="site-header"></div> ... <div id="site-footer"></div>
 * Optional: <body data-page="about"> to highlight the active nav link.
 */
(function () {
  "use strict";

  var NAV_LINKS = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "about.html", label: "About", key: "about" },
    {
      label: "Courses", key: "courses",
      href: "courses.html",
      children: [
        { href: "courses.html#ai-ml", label: "AI & Machine Learning" },
        { href: "courses.html#programming", label: "Programming" },
        { href: "courses.html#electronics", label: "Electronics & VLSI" },
        { href: "courses.html#data", label: "Python, SQL & Power BI" }
      ]
    },
    { href: "notes.html", label: "Notes", key: "notes" },
    { href: "projects.html", label: "Projects", key: "projects" },
    { href: "blog.html", label: "Blog", key: "blog" },
    { href: "ai-tools.html", label: "AI Tools", key: "ai-tools" },
    { href: "resources.html", label: "Resources", key: "resources" },
    { href: "contact.html", label: "Contact", key: "contact" }
  ];

  function renderLinks(activeKey) {
    return NAV_LINKS.map(function (item) {
      var isActive = item.key === activeKey ? " active" : "";
      if (item.children) {
        return (
          '<li class="has-dropdown">' +
            '<a href="' + item.href + '" class="' + isActive.trim() + '">' + item.label + ' <i class="fa-solid fa-chevron-down" style="font-size:.65em;"></i></a>' +
            '<ul class="dropdown-menu">' +
              item.children.map(function (c) { return '<li><a href="' + c.href + '">' + c.label + '</a></li>'; }).join("") +
            '</ul>' +
          '</li>'
        );
      }
      return '<li><a href="' + item.href + '" class="' + isActive.trim() + '">' + item.label + '</a></li>';
    }).join("");
  }

  function headerTemplate(activeKey) {
    return (
      '<div class="news-ticker" aria-label="Breaking news ticker">' +
        '<span class="news-ticker__label"><i class="fa-solid fa-bolt"></i> Breaking</span>' +
        '<div class="news-ticker__track" id="ticker-track">' +
          '<span class="news-ticker__item">Loading latest updates in AI &amp; Engineering education&hellip;</span>' +
        '</div>' +
      '</div>' +
      '<nav class="navbar" aria-label="Primary">' +
        '<div class="container">' +
          '<a href="index.html" class="brand" aria-label="Neha Edu Labs home">' +
            '<span class="brand__mark"><i class="fa-solid fa-graduation-cap"></i></span>' +
            '<span class="brand__text"><span>Neha Edu Labs</span><span class="brand__tagline">Learn. Build. Grow.</span></span>' +
          '</a>' +
          '<ul class="nav-links" id="navLinks">' + renderLinks(activeKey) + '</ul>' +
          '<div class="nav-actions">' +
            '<button class="search-toggle" id="searchToggle" aria-label="Open search"><i class="fa-solid fa-magnifying-glass"></i></button>' +
            '<button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode"><i class="fa-solid fa-moon"></i><i class="fa-solid fa-sun"></i></button>' +
            '<button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
          '</div>' +
        '</div>' +
      '</nav>' +
      '<div class="search-overlay" id="searchOverlay">' +
        '<div class="search-box" role="dialog" aria-modal="true" aria-label="Site search">' +
          '<div class="flex-between mb-1">' +
            '<strong><i class="fa-solid fa-magnifying-glass"></i> Search Neha Edu Labs</strong>' +
            '<button id="searchClose" aria-label="Close search" class="btn-icon btn-outline"><i class="fa-solid fa-xmark"></i></button>' +
          '</div>' +
          '<input type="text" id="searchInput" placeholder="Search courses, notes, blog, projects, AI tools&hellip;" autocomplete="off" />' +
          '<div class="search-results" id="searchResults"><p class="search-empty">Start typing to search the entire site.</p></div>' +
        '</div>' +
      '</div>'
    );
  }

  function footerTemplate() {
    var year = new Date().getFullYear();
    return (
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a href="index.html" class="brand" style="color:#fff;">' +
              '<span class="brand__mark"><i class="fa-solid fa-graduation-cap"></i></span>' +
              '<span class="brand__text"><span>Neha Edu Labs</span></span>' +
            '</a>' +
            '<p>A modern learning platform for Engineering, Electronics, VLSI, Embedded Systems, Programming and Artificial Intelligence &mdash; built by educator Neha Badgujar.</p>' +
            '<div class="social-links">' +
              '<a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>' +
              '<a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>' +
              '<a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>' +
              '<a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>' +
              '<a href="https://x.com" target="_blank" rel="noopener" aria-label="X (Twitter)"><i class="fa-brands fa-x-twitter"></i></a>' +
            '</div>' +
          '</div>' +
          '<div><h4>Learn</h4><ul>' +
            '<li><a href="courses.html">All Courses</a></li>' +
            '<li><a href="notes.html">Free Notes</a></li>' +
            '<li><a href="projects.html">Student Projects</a></li>' +
            '<li><a href="ai-tools.html">AI Tools Directory</a></li>' +
            '<li><a href="resources.html#quiz">Daily Quiz</a></li>' +
          '</ul></div>' +
          '<div><h4>Explore</h4><ul>' +
            '<li><a href="blog.html">Blog</a></li>' +
            '<li><a href="about.html">About Neha</a></li>' +
            '<li><a href="about.html#research">Research</a></li>' +
            '<li><a href="resources.html#career">Career Corner</a></li>' +
            '<li><a href="resources.html">Resources</a></li>' +
          '</ul></div>' +
          '<div><h4>Categories</h4><ul>' +
            '<li><a href="courses.html#ai-ml">Artificial Intelligence</a></li>' +
            '<li><a href="courses.html#electronics">VLSI &amp; Embedded</a></li>' +
            '<li><a href="courses.html#programming">Python &amp; SQL</a></li>' +
            '<li><a href="courses.html#electronics">Digital Electronics</a></li>' +
          '</ul></div>' +
          '<div><h4>Get in touch</h4><ul>' +
            '<li><i class="fa-solid fa-envelope"></i>&nbsp; contact@nehaedulabs.online</li>' +
            '<li><i class="fa-solid fa-location-dot"></i>&nbsp; Pune, Maharashtra, India</li>' +
            '<li class="mt-2"><a href="contact.html" class="btn btn-outline btn-sm" style="border-color:rgba(255,255,255,.2);">Contact Us</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>&copy; ' + year + ' Neha Edu Labs. All rights reserved.</span>' +
          '<div class="legal-links"><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms of Service</a><a href="sitemap.xml">Sitemap</a></div>' +
        '</div>' +
      '</div>' +
      '<button class="back-to-top" id="backToTop" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></button>'
    );
  }

  function injectPartials() {
    var headerEl = document.getElementById("site-header");
    var footerEl = document.getElementById("site-footer");
    var activeKey = document.body.getAttribute("data-page") || "home";
    if (headerEl) headerEl.innerHTML = headerTemplate(activeKey);
    if (footerEl) footerEl.innerHTML = footerTemplate();
  }

  /* ---------------------------- Dark Mode ---------------------------- */
  function initTheme() {
    var stored = localStorage.getItem("nel-theme");
    if (stored) document.documentElement.setAttribute("data-theme", stored);
    var toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      var next;
      if (current === "dark") next = "light";
      else if (current === "light") next = "dark";
      else {
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        next = prefersDark ? "light" : "dark";
      }
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("nel-theme", next);
    });
  }

  /* ---------------------------- Mobile Nav ---------------------------- */
  function initMobileNav() {
    var navToggle = document.getElementById("navToggle");
    var navLinks = document.getElementById("navLinks");
    if (!navToggle || !navLinks) return;
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    navLinks.querySelectorAll(".has-dropdown > a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          a.parentElement.classList.toggle("open");
        }
      });
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (!a.parentElement.classList.contains("has-dropdown")) {
          navLinks.classList.remove("open");
          navToggle.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });
  }

  /* ---------------------------- Back to top ---------------------------- */
  function initBackToTop() {
    var btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 500);
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------- Search overlay ---------------------------- */
  function initSearch() {
    var toggle = document.getElementById("searchToggle");
    var overlay = document.getElementById("searchOverlay");
    var closeBtn = document.getElementById("searchClose");
    var input = document.getElementById("searchInput");
    if (!toggle || !overlay) return;

    function open() {
      overlay.classList.add("open");
      setTimeout(function () { input.focus(); }, 50);
    }
    function close() {
      overlay.classList.remove("open");
    }
    toggle.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); open(); }
    });

    if (window.NELSearch && input) {
      input.addEventListener("input", function () {
        window.NELSearch.render(input.value);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectPartials();
    initTheme();
    initMobileNav();
    initBackToTop();
    initSearch();
    document.dispatchEvent(new CustomEvent("nel:partials-ready"));
  });
})();
