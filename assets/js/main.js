/*!
 * NEHA EDU LABS — main.js
 * Page loader, AOS/Typed.js init, animated counters, accordion, newsletter form,
 * PWA install prompt and service worker registration.
 */
(function () {
  "use strict";

  /* ---------------------------- Page loader ---------------------------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("pageLoader");
    if (loader) setTimeout(function () { loader.classList.add("hide"); }, 250);
  });

  /* ---------------------------- AOS ---------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    if (window.AOS) {
      AOS.init({ duration: 700, once: true, offset: 60, easing: "ease-out-cubic" });
    }
  });

  /* ---------------------------- Typed.js hero headline ---------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var el = document.getElementById("typed-target");
    if (el && window.Typed) {
      new Typed("#typed-target", {
        strings: [
          "Artificial Intelligence.",
          "VLSI Design.",
          "Embedded Systems.",
          "Python &amp; SQL.",
          "Digital Electronics.",
          "Your Engineering Career."
        ],
        typeSpeed: 55,
        backSpeed: 28,
        backDelay: 1600,
        loop: true,
        smartBackspace: true
      });
    }
  });

  /* ---------------------------- Animated counters ---------------------------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = (target % 1 !== 0 ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { observer.observe(c); });
  }
  document.addEventListener("DOMContentLoaded", initCounters);

  /* ---------------------------- Accordion (FAQ) ---------------------------- */
  document.addEventListener("click", function (e) {
    var header = e.target.closest(".accordion-header");
    if (!header) return;
    var item = header.closest(".accordion-item");
    var wasOpen = item.classList.contains("open");
    item.parentElement.querySelectorAll(".accordion-item").forEach(function (i) { i.classList.remove("open"); });
    if (!wasOpen) item.classList.add("open");
  });

  /* ---------------------------- Newsletter + Contact forms (client-side only) ---------------------------- */
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (form.matches(".newsletter-form")) {
      e.preventDefault();
      var email = form.querySelector("input[type=email]");
      if (!email || !email.value) return;
      var successEl = form.parentElement.querySelector(".form-success") || form.nextElementSibling;
      if (successEl && successEl.classList.contains("form-success")) {
        successEl.textContent = "Thanks! " + email.value + " has been subscribed. Watch your inbox for updates.";
        successEl.classList.add("show");
      }
      form.reset();
    }
    if (form.matches("#contactForm")) {
      e.preventDefault();
      var status = document.getElementById("contactStatus");
      if (status) {
        status.textContent = "Thank you! Your message has been noted. Neha's team will reach out within 2 business days.";
        status.classList.add("show");
      }
      form.reset();
    }
  });

  /* ---------------------------- Smooth scroll for in-page anchors ---------------------------- */
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]:not([href="#"])');
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    var target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      var navH = (document.querySelector(".site-header") || {}).offsetHeight || 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;
      window.scrollTo({ top: top, behavior: "smooth" });
    }
  });

  /* ---------------------------- PWA install banner ---------------------------- */
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var banner = document.getElementById("installBanner");
    if (banner) banner.classList.add("show");
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest("#installAccept")) {
      if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; }
      var banner = document.getElementById("installBanner");
      if (banner) banner.classList.remove("show");
    }
    if (e.target.closest("#installDismiss")) {
      var banner2 = document.getElementById("installBanner");
      if (banner2) banner2.classList.remove("show");
    }
  });

  /* ---------------------------- Service worker ---------------------------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  /* ---------------------------- Current year ---------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".current-year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  });
})();
