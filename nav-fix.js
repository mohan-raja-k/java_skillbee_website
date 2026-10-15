/* nav-fix.js - one long page: every section is always visible, and the menu buttons scroll to their section
   (instead of showing only that section). Also highlights the current section in the menu while scrolling. */
(function () {
  var NAME_HINTS = {
    home: /home|hero|welcome/i,
    vision: /vision|mission/i,
    leadership: /leader/i,
    events: /event/i,
    winners: /winner|contest/i,
    team: /team/i
  };

  function css() {
    if (document.getElementById("nv-style")) return;
    var s = document.createElement("style");
    s.id = "nv-style";
    s.textContent =
      "html{scroll-behavior:smooth}" +
      "section,section.sec{display:block!important;visibility:visible!important}" +
      "section.hero,.hero{display:flex!important}" +
      "section[hidden],.sec[hidden]{display:block!important}" +
      "section,.sec,[data-nv]{scroll-margin-top:96px}";
    document.head.appendChild(s);
  }

  function links() {
    return Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#'], #menu a[href^='#']"));
  }

  function idOf(a) { return (a.getAttribute("href") || "").replace(/^#/, ""); }

  // find the section a menu link points to
  function targetFor(a) {
    var id = idOf(a);
    var el = id && document.getElementById(id);
    if (el) return el;
    el = id && document.querySelector("[data-page='" + id + "'],[data-section='" + id + "'],[name='" + id + "']");
    if (el) return el;
    var key = null;
    Object.keys(NAME_HINTS).forEach(function (k) {
      if (NAME_HINTS[k].test(id) || NAME_HINTS[k].test(a.textContent)) { if (!key) key = k; }
    });
    if (!key) return null;
    if (key === "home") return document.querySelector(".hero") || document.body;
    var secs = document.querySelectorAll("section");
    for (var i = 0; i < secs.length; i++) {
      var h = secs[i].querySelector("h1,h2,h3,.title");
      if (h && NAME_HINTS[key].test(h.textContent)) return secs[i];
    }
    return null;
  }

  // un-hide every section the old script may have hidden
  function showAll() {
    css();
    Array.prototype.forEach.call(document.querySelectorAll("section"), function (sec) {
      if (sec.hasAttribute("hidden")) sec.removeAttribute("hidden");
      if (sec.style && sec.style.display === "none") sec.style.removeProperty("display");
      sec.setAttribute("data-nv", "1");
    });
  }

  function navHeight() {
    var n = document.querySelector(".nav");
    return n ? n.offsetHeight : 90;
  }

  function goTo(el, id) {
    var y;
    if (!el || el === document.body || el.classList.contains("hero")) y = 0;
    else y = el.getBoundingClientRect().top + window.pageYOffset - navHeight() - 8;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    try { history.replaceState(null, "", "#" + id); } catch (e) {}
  }

  // take over the clicks before the old script can hide the other sections
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".nav a[href^='#'], #menu a[href^='#'], .brand[href^='#']");
    if (!a) return;
    var el = targetFor(a);
    e.preventDefault();
    e.stopImmediatePropagation();
    showAll();
    goTo(el, idOf(a) || "home");
    setActive(a);
  }, true);

  function setActive(active) {
    links().forEach(function (a) {
      if (a.closest("#menu")) a.classList.toggle("on", a === active);
    });
  }

  // highlight the menu item of the section currently on screen
  function spy() {
    var line = navHeight() + 140;
    var best = null, bestTop = -Infinity;
    links().forEach(function (a) {
      if (!a.closest("#menu")) return;
      var el = targetFor(a);
      if (!el) return;
      var top = el.getBoundingClientRect().top;
      if (top <= line && top > bestTop) { bestTop = top; best = a; }
    });
    if (!best) {
      var first = links().filter(function (a) { return a.closest("#menu"); })[0];
      best = first || null;
    }
    if (best) setActive(best);
  }

  var tick = null;
  window.addEventListener("scroll", function () {
    if (tick) return;
    tick = setTimeout(function () { tick = null; spy(); }, 80);
  }, { passive: true });

  // keep sections visible even if the old script tries to hide them again
  var guard = null;
  function watch() {
    new MutationObserver(function () {
      clearTimeout(guard);
      guard = setTimeout(showAll, 60);
    }).observe(document.body, { attributes: true, attributeFilter: ["hidden", "style", "class"], subtree: true, childList: true });
  }

  function start() {
    showAll();
    setTimeout(showAll, 300);
    setTimeout(showAll, 1000);
    watch();
    // a link such as index.html#team: jump there once everything has loaded
    var h = location.hash.replace(/^#/, "");
    if (h) {
      setTimeout(function () {
        var el = document.getElementById(h);
        if (!el) {
          var a = links().filter(function (x) { return idOf(x) === h; })[0];
          el = a && targetFor(a);
        }
        if (el) goTo(el, h);
      }, 700);
    }
    spy();
  }

  // the old hashchange handler would hide sections again, so ignore it
  window.addEventListener("hashchange", function (e) { e.stopImmediatePropagation(); showAll(); }, true);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();