/* ══════════════════════════════════════════════════════════════
   ADVERSING | main.js
   اسکریپت‌های نمایشی قالب خام (بدون بک‌اند / بدون وابستگی)
   1) هدر چسبان  2) منوی موبایل  3) اسلایدر هیرو
   4) اسلایدر نظرات  5) علاقه‌مندی  6) لینک فعال منو
   ══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ---------- 1) هدر چسبان ---------- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (window.scrollY > 12) header.classList.add("is-stuck");
    else header.classList.remove("is-stuck");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2) منوی موبایل ---------- */
  var menuToggle = document.getElementById("menuToggle");
  var mainNav = document.getElementById("mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- 3) اسلایدر هیرو ---------- */
  var slider = document.getElementById("heroSlider");
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dotsBox = document.getElementById("heroDots");
    var current = 0;
    var timer = null;
    var DURATION = 7000;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "اسلاید " + (i + 1));
      dot.addEventListener("click", function () { goTo(i, true); });
      dotsBox.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsBox.children);

    function render() {
      slides.forEach(function (s, i) {
        s.classList.toggle("is-current", i === current);
        s.setAttribute("aria-hidden", i === current ? "false" : "true");
      });
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === current);
        d.setAttribute("aria-selected", i === current ? "true" : "false");
      });
    }

    function goTo(index, stop) {
      current = (index + slides.length) % slides.length;
      render();
      if (stop) restart();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, DURATION);
    }

    document.getElementById("heroNext").addEventListener("click", function () { goTo(current + 1, true); });
    document.getElementById("heroPrev").addEventListener("click", function () { goTo(current - 1, true); });

    slider.addEventListener("mouseenter", function () { clearInterval(timer); });
    slider.addEventListener("mouseleave", restart);

    /* کشیدن با لمس/ماوس */
    var startX = null;
    slider.addEventListener("pointerdown", function (e) { startX = e.clientX; });
    slider.addEventListener("pointerup", function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 60) { dx > 0 ? prev() : next(); restart(); }
      startX = null;
    });

    render();
    restart();
  }

  /* ---------- 4) اسلایدر نظرات ---------- */
  var track = document.getElementById("testiTrack");
  if (track) {
    var step = function () {
      var card = track.querySelector(".testi-card");
      return card ? card.getBoundingClientRect().width + 16 : 320;
    };
    /* در حالت RTL مقدار scrollLeft منفی است */
    document.getElementById("testiNext").addEventListener("click", function () {
      track.scrollBy({ left: -step(), behavior: "smooth" });
    });
    document.getElementById("testiPrev").addEventListener("click", function () {
      track.scrollBy({ left: step(), behavior: "smooth" });
    });
  }

  /* ---------- 5) علاقه‌مندی ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".wish"), function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var active = btn.classList.toggle("is-active");
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  });

  /* ---------- 6) لینک فعال منو بر اساس اسکرول ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".main-nav a[href^='#']"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return { link: link, section: document.getElementById(id) };
    })
    .filter(function (item) { return item.section; });

  if (sections.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.remove("is-active"); });
        var match = sections.find(function (s) { return s.section === entry.target; });
        if (match) match.link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { io.observe(s.section); });
  }
})();
