/* animations-fix.js (v2: + ripple, sparkle trail, 3D tilt, parallax) - adds smooth animations to the whole site (safe to remove: just delete the script line). */
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CSS = [
    /* ---- hero entrance ---- */
    "@keyframes an-up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}",
    "@keyframes an-pop{from{opacity:0;transform:scale(.7) rotate(-8deg)}to{opacity:1;transform:none}}",
    "@keyframes an-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}",
    "@keyframes an-glow{0%,100%{box-shadow:0 0 0 0 rgba(255,23,40,.55)}70%{box-shadow:0 0 0 26px rgba(255,23,40,0)}}",
    "@keyframes an-shine{to{background-position:200% center}}",
    "@keyframes an-orb{0%{transform:translate(0,0) scale(1);opacity:.0}15%{opacity:.5}100%{transform:translate(var(--dx),-120vh) scale(1.4);opacity:0}}",
    ".hero .hero-logo{animation:an-pop .9s cubic-bezier(.2,.9,.3,1.3) both,an-float 5s ease-in-out 1s infinite}",
    ".hero .hf-college,.hero .college{animation:an-up .8s ease .25s both}",
    ".hero h1{animation:an-up .8s ease .45s both;background:linear-gradient(100deg,#FFD700 20%,#ffffff 45%,#FFD700 70%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:an-up .8s ease .45s both,an-shine 4s linear 1.3s infinite}",
    ".hero .tag{animation:an-up .8s ease .65s both}",
    ".hero .about{animation:an-up .8s ease .85s both}",
    ".an-orb{position:absolute;bottom:-40px;border-radius:50%;background:radial-gradient(circle,rgba(255,201,40,.55),rgba(255,201,40,0) 70%);pointer-events:none;z-index:-1;animation:an-orb var(--t,14s) linear infinite;animation-delay:var(--d,0s)}",

    /* ---- scroll progress + back to top ---- */
    "#an-bar{position:fixed;left:0;top:0;height:4px;width:0;z-index:9998;background:linear-gradient(90deg,#FFD700,#b3202a,#12295e);transition:width .1s linear}",
    "#an-top{position:fixed;right:22px;bottom:22px;width:48px;height:48px;border:none;border-radius:50%;background:#FF1728;color:#fff;font-size:24px;font-weight:700;cursor:pointer;z-index:9997;opacity:0;transform:translateY(20px) scale(.8);pointer-events:none;transition:all .3s;box-shadow:0 6px 18px rgba(0,0,0,.3)}",
    "#an-top.show{opacity:1;transform:none;pointer-events:auto;animation:an-glow 2.4s infinite}",
    "#an-top:hover{background:#FFD700;color:#0a1a40}",

    /* ---- nav ---- */
    ".nav{transition:padding .3s,box-shadow .3s}",
    ".nav.an-scrolled{padding-top:4px;padding-bottom:4px;box-shadow:0 8px 24px rgba(10,26,64,.25)}",
    "#menu a{position:relative;transition:background .25s,color .25s,transform .25s}",
    "#menu a:hover{transform:translateY(-2px)}",
    ".brand img{transition:transform .6s}",
    ".brand:hover img{transform:rotate(360deg)}",

    /* ---- scroll reveal ---- */
    ".an-r{opacity:0;transform:translateY(40px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1);transition-delay:var(--rd,0s)}",
    ".an-r.an-l{transform:translateX(-50px)}",
    ".an-r.an-rt{transform:translateX(50px)}",
    ".an-r.an-in{opacity:1;transform:none}",

    /* ---- headings: underline draws itself ---- */
    ".title{position:relative;border-bottom-color:transparent!important}",
    ".title::after{content:'';position:absolute;left:0;bottom:0;height:5px;width:0;background:#FFD700;border-radius:4px;transition:width 1s ease .2s}",
    ".title.an-in::after{width:100%}",

    /* ---- hover lifts ---- */
    ".person,.pillars article,.mv article,.leader,.tf-card{transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .35s}",
    ".person.an-in:hover,.pillars article.an-in:hover,.mv article.an-in:hover,.tf-card.an-in:hover{transform:translateY(-10px) scale(1.02);box-shadow:0 18px 38px rgba(10,26,64,.28)}",
    ".leader.an-in:hover{transform:translateX(8px);box-shadow:0 14px 34px rgba(10,26,64,.25)}",
    ".person img,.leader img,.tf-card img{transition:transform .6s ease}",
    ".person:hover img,.leader:hover img,.tf-card:hover img{transform:scale(1.07)}",
    ".person .ph,.leader .ph,.tf-card{overflow:hidden}",
    ".sub,.tf-role{transition:transform .25s}",
    ".person:hover .sub,.tf-card:hover .tf-role{transform:scale(1.08)}",
    "tbody tr{transition:background .25s}",
    "tbody tr:hover td{background:#fff3c4}",

    /* ---- event / winner strips + contact ---- */
    ".ef-item,.wf-item{transition:transform .35s,box-shadow .35s}",
    ".ef-item:hover,.wf-item:hover{transform:scale(1.04);box-shadow:0 12px 30px rgba(0,0,0,.3);position:relative;z-index:3}",
    ".cf-btn svg{transition:transform .35s}",
    ".cf-btn:hover svg{transform:rotate(-12deg) scale(1.25)}",
    ".cf-qr{transition:transform .3s,box-shadow .3s}",
    ".cf-qr:hover{transform:translateY(-6px) rotate(-1deg);box-shadow:0 16px 34px rgba(0,0,0,.35)}",

    /* ---- more effects: ripple, sparkles, tilt ---- */
    "@keyframes an-ripple{to{transform:scale(3.2);opacity:0}}",
    "@keyframes an-spark{0%{opacity:.9;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,calc(-50% + 26px)) scale(.2)}}",
    "@keyframes an-wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}",
    "@keyframes an-breathe{0%,100%{scale:1}50%{scale:1.04}}",
    ".an-rip{position:relative;overflow:hidden}",
    ".an-rip>.an-rp{position:absolute;border-radius:50%;background:rgba(255,255,255,.65);width:60px;height:60px;margin:-30px 0 0 -30px;pointer-events:none;animation:an-ripple .6s ease-out forwards}",
    ".an-sp{position:fixed;width:9px;height:9px;border-radius:50%;pointer-events:none;z-index:9996;background:radial-gradient(circle,#fff3b0,#FFD700 60%,rgba(255,23,40,0));animation:an-spark .8s ease-out forwards}",
    ".an-tilt{transition:transform .15s ease-out,box-shadow .35s!important;transform-style:preserve-3d}",
    ".cf-btn,.cf-qr{animation:an-breathe 4s ease-in-out infinite}",
    ".cf-btn:nth-child(2){animation-delay:.5s}.cf-btn:nth-child(3){animation-delay:1s}.cf-btn:nth-child(4){animation-delay:1.5s}",
    "#menu a.on{animation:an-breathe 3s ease-in-out infinite}",
    ".hero h1{letter-spacing:.01em}",
    /* ---- OUR TEAM section extras ---- */
    "@keyframes tm-bob{0%,100%{translate:0 0}50%{translate:0 -9px}}",
    "@keyframes tm-shine{0%{transform:translateX(-160%) skewX(-20deg)}16%{transform:translateX(430%) skewX(-20deg)}100%{transform:translateX(430%) skewX(-20deg)}}",
    "@keyframes tm-shine-h{from{transform:translateX(-160%) skewX(-20deg)}to{transform:translateX(430%) skewX(-20deg)}}",
    "@property --ang{syntax:'<angle>';inherits:false;initial-value:0deg}",
    "@keyframes tm-spin{to{--ang:360deg}}",
    "@keyframes tm-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,.55)}60%{box-shadow:0 0 0 9px rgba(255,215,0,0)}}",
    "@keyframes tm-img{from{clip-path:inset(100% 0 0 0);scale:1.3;filter:brightness(1.8)}to{clip-path:inset(0 0 0 0);scale:1;filter:none}}",
    "@keyframes tm-rise{0%{top:104%;opacity:0}12%{opacity:.7}88%{opacity:.7}100%{top:-6%;opacity:0}}",
    ".tf-grid{perspective:1200px;position:relative;z-index:1}",
    ".tf-card,.person{position:relative}",
    ".tf-card.an-r{transform:translateY(70px) rotateX(40deg) scale(.82)}",
    ".tf-card.an-r.an-in{transform:none}",
    ".tf-card.an-in,.person.an-in{animation:tm-bob 5.5s ease-in-out infinite}",
    ".tf-card:nth-child(2n){animation-delay:.7s!important}.tf-card:nth-child(3n){animation-delay:1.4s!important}.tf-card:nth-child(5n){animation-delay:2.1s!important}",
    ".tf-card:hover,.person:hover{animation-play-state:paused}",
    ".tf-card::after,.person::after{content:'';position:absolute;top:0;left:0;width:38%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,215,0,.12) 30%,rgba(255,236,150,.38) 50%,rgba(255,215,0,.12) 70%,transparent);transform:translateX(-160%) skewX(-20deg);pointer-events:none;z-index:3;animation:tm-shine 7s ease-in-out infinite;animation-delay:calc(var(--i,0) * .5s + 1.5s)}",
    ".tf-card:hover::after,.person:hover::after{animation:tm-shine-h .9s ease}",
    /* animated gradient border: red / blue / gold, slowly moving */
    "body .tf-grid .tf-card:nth-child(n),body .grid.team .person:nth-child(n){border:2px solid transparent!important;background:linear-gradient(#18181B,#18181B) padding-box,conic-gradient(from var(--ang),#FF1728,#0756C9,#FFD700,#0756C9,#FF1728) border-box!important;animation-name:tm-bob,tm-spin;animation-duration:5.5s,9s;animation-timing-function:ease-in-out,linear;animation-iteration-count:infinite,infinite}",
    ".tf-card::before,.person::before{content:'';position:absolute;inset:0;background:radial-gradient(240px circle at var(--mx,50%) var(--my,50%),rgba(255,23,40,.3),transparent 62%);opacity:0;transition:opacity .3s;pointer-events:none;z-index:2}",
    ".tf-card:hover::before,.person:hover::before{opacity:1}",
    ".tf-card.an-in img{animation:tm-img 1.1s cubic-bezier(.2,.8,.2,1) .15s both}",
    ".tf-card.an-in .tf-name{animation:an-up .7s ease .4s both}",
    ".tf-card.an-in .tf-role{animation:an-up .7s ease .55s both,tm-pulse 2.8s ease-in-out 1.6s infinite}",
    ".tf-card.an-in .tf-dept{animation:an-up .7s ease .7s both}",
    ".tm-dot{position:absolute;top:104%;border-radius:50%;pointer-events:none;z-index:0;opacity:0;animation:tm-rise var(--t,16s) linear infinite;animation-delay:var(--d,0s)}",
    /* ---- reduced motion ---- */
    "@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.an-r{opacity:1!important;transform:none!important}.hero h1{-webkit-text-fill-color:#FFD700!important}}"
  ].join("\n");

  function addCss() {
    if (document.getElementById("an-style")) return;
    var s = document.createElement("style");
    s.id = "an-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- scroll reveal ---------- */
  var io = null;
  function observer() {
    if (io || !("IntersectionObserver" in window)) return io;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("an-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    return io;
  }

  var TARGETS = ".title,.sub-title,.mv article,.pillars article,.tablewrap,.leader,.person,.tf-card,.ef-wrap,.wf-wrap,.strip,.cf-wrap,.about-card,.card";
  function reveal() {
    var o = observer();
    var list = document.querySelectorAll(TARGETS);
    Array.prototype.forEach.call(list, function (el) {
      if (el.getAttribute("data-an")) return;
      el.setAttribute("data-an", "1");
      if (!o || reduce) { el.classList.add("an-in"); return; }
      el.classList.add("an-r");
      if (el.classList.contains("leader")) el.classList.add(Array.prototype.indexOf.call(el.parentNode.children, el) % 2 ? "an-rt" : "an-l");
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--rd", Math.min(i, 8) * 0.08 + "s");
      o.observe(el);
    });
  }

  /* ---------- floating gold orbs in the hero ---------- */
  function orbs() {
    var hero = document.querySelector(".hero");
    if (!hero || hero.querySelector(".an-orb") || reduce) return;
    for (var i = 0; i < 9; i++) {
      var o = document.createElement("span");
      o.className = "an-orb";
      var size = 14 + Math.round(Math.random() * 46);
      o.style.width = o.style.height = size + "px";
      o.style.left = Math.round(Math.random() * 96) + "%";
      o.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      o.style.setProperty("--t", (10 + Math.random() * 10) + "s");
      o.style.setProperty("--d", (-Math.random() * 14) + "s");
      hero.appendChild(o);
    }
  }

  /* ---------- progress bar, nav shrink, back-to-top ---------- */
  function chrome() {
    if (document.getElementById("an-bar")) return;
    var bar = document.createElement("div"); bar.id = "an-bar"; document.body.appendChild(bar);
    var top = document.createElement("button");
    top.id = "an-top"; top.type = "button"; top.setAttribute("aria-label", "Back to top"); top.innerHTML = "&#8593;";
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
    document.body.appendChild(top);
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      var nav = document.querySelector(".nav");
      if (nav) nav.classList.toggle("an-scrolled", window.scrollY > 40);
      top.classList.toggle("show", window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }


  /* ---------- parallax on the hero photo ---------- */
  function parallax() {
    if (reduce) return;
    var hero = document.querySelector(".hero");
    if (!hero) return;
    var y = Math.min(window.scrollY, 900) * 0.25;
    hero.style.setProperty("--py", y + "px");
  }

  /* ---------- click ripple on buttons ---------- */
  document.addEventListener("click", function (e) {
    if (reduce) return;
    var b = e.target.closest && e.target.closest("#menu a, .cf-btn, .ef-btn, #an-top");
    if (!b) return;
    b.classList.add("an-rip");
    var r = b.getBoundingClientRect();
    var d = document.createElement("span");
    d.className = "an-rp";
    d.style.left = (e.clientX - r.left) + "px";
    d.style.top = (e.clientY - r.top) + "px";
    b.appendChild(d);
    setTimeout(function () { d.remove(); }, 650);
  });

  /* ---------- gold sparkle trail behind the cursor (desktop only) ---------- */
  var lastSp = 0;
  if (!reduce && window.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.addEventListener("mousemove", function (e) {
      var now = Date.now();
      if (now - lastSp < 55) return;
      lastSp = now;
      var s = document.createElement("span");
      s.className = "an-sp";
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      document.body.appendChild(s);
      setTimeout(function () { s.remove(); }, 820);
    }, { passive: true });
  }

  /* ---------- 3D tilt on cards ---------- */
  if (!reduce && window.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.addEventListener("mousemove", function (e) {
      var card = e.target.closest && e.target.closest(".person, .tf-card, .pillars article, .mv article");
      Array.prototype.forEach.call(document.querySelectorAll(".an-tilt"), function (t) {
        if (t !== card) { t.classList.remove("an-tilt"); t.style.transform = ""; }
      });
      if (!card || !card.classList.contains("an-in")) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add("an-tilt");
      card.style.transform = "perspective(800px) rotateY(" + (px * 8) + "deg) rotateX(" + (-py * 8) + "deg) translateY(-6px) scale(1.02)";
    }, { passive: true });
  }
  window.addEventListener("scroll", parallax, { passive: true });


  /* ---------- Our Team: floating dots + spotlight following the cursor ---------- */
  function teamExtras() {
    var grid = document.querySelector(".tf-grid") || document.querySelector(".grid.team");
    if (!grid || reduce) return;
    var sec = grid.closest("section") || grid.parentElement;
    if (!sec || sec.querySelector(".tm-dot")) return;
    sec.style.position = "relative";
    sec.style.overflow = "hidden";
    var colors = ["#FF1728", "#0756C9", "#FFD700", "#168BFF"];
    for (var i = 0; i < 16; i++) {
      var d = document.createElement("span");
      d.className = "tm-dot";
      var size = 6 + Math.round(Math.random() * 14);
      d.style.width = d.style.height = size + "px";
      d.style.left = Math.round(Math.random() * 98) + "%";
      d.style.background = colors[i % colors.length];
      d.style.boxShadow = "0 0 12px " + colors[i % colors.length];
      d.style.setProperty("--t", (12 + Math.random() * 12) + "s");
      d.style.setProperty("--d", (-Math.random() * 20) + "s");
      sec.insertBefore(d, sec.firstChild);
    }
  }
  document.addEventListener("mousemove", function (e) {
    var c = e.target.closest && e.target.closest(".tf-card, .person");
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty("--mx", (e.clientX - r.left) + "px");
    c.style.setProperty("--my", (e.clientY - r.top) + "px");
  }, { passive: true });


  /* ---------- Our Team: cinematic stagger (cards appear one after another, row by row) ---------- */
  function teamStagger() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".tf-card, .grid.team .person"));
    if (!cards.length || !cards[0].offsetParent) return;
    var top0 = cards[0].offsetTop, cols = 0;
    cards.forEach(function (c) { if (Math.abs(c.offsetTop - top0) < 8) cols++; });
    cols = Math.max(cols, 1);
    cards.forEach(function (c, i) {
      if (c.getAttribute("data-ts") === "1") return;
      c.setAttribute("data-ts", "1");
      c.style.setProperty("--rd", (Math.min(i % cols, 7) * 0.18 + 0.05) + "s");
      c.style.setProperty("--i", i);
    });
  }

  function run() { addCss(); chrome(); orbs(); reveal(); teamStagger(); parallax(); teamExtras(); }

  function start() {
    run();
    // pages are built by scripts after load, so keep picking up new elements
    var t = null;
    new MutationObserver(function () {
      clearTimeout(t);
      t = setTimeout(run, 120);
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();