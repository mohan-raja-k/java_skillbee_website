/* contact-fix.js
   1) swaps the club logo for the sharp logo-hd.png
   2) adds a "Connect With Us" block (LinkedIn, YouTube, Email, Instagram + QR) at the bottom of every page */
(function () {
  var LOGO = "logo-hd.png";
  var QR = "instagram-qr.jpg";
  var LINKS = {
    linkedin: "https://www.linkedin.com/in/java-skill-bee-vmkvec-33746235b",
    youtube: "https://www.youtube.com/@Pavatharani19",
    email: "mailto:javaskillbees@gmail.com",
    instagram: "https://www.instagram.com/java_skillbee_club_vmkvec/"
  };
  var ICON = {
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.78 2.66 4.78 6.1V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.7V21h-4z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2C.5 9.1.5 12 .5 12s0 2.9.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-4.8.5-4.8s0-2.9-.5-4.8zM9.8 15.4V8.6L15.7 12z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.5 2v.3L12 12.6l7.5-5.3V7zm15 2.7-7.5 5.3-7.5-5.3V17h15z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>'
  };

  function css() {
    if (document.getElementById("cf-style")) return;
    var s = document.createElement("style");
    s.id = "cf-style";
    s.textContent =
      "body .hero-logo{height:280px!important;width:280px!important;background:transparent!important;border:none!important;object-fit:contain;filter:drop-shadow(0 8px 18px rgba(0,0,0,.45))}@media(max-width:700px){body .hero-logo{height:190px!important;width:190px!important}}" +
      "body .brand img{background:transparent!important;object-fit:contain}" +
      ".cf-wrap{max-width:1100px;margin:0 auto 26px;padding:6px 5% 26px;border-bottom:1px solid rgba(255,255,255,.18)}" +
      ".cf-title{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:clamp(1.5rem,3.2vw,2.1rem);font-weight:800;color:#FFD700;margin:6px 0 4px}" +
      ".cf-sub{color:#e9e2c8;margin-bottom:20px}" +
      ".cf-row{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:stretch}" +
      ".cf-btn{display:inline-flex;align-items:center;gap:10px;padding:12px 20px;border-radius:999px;background:#fff;color:#12295e;font-weight:700;text-decoration:none;border:2px solid #FFD700;transition:transform .15s,background .15s,color .15s}" +
      ".cf-btn:hover{transform:translateY(-3px);background:#FFD700;color:#0a1a40}" +
      ".cf-btn svg{width:22px;height:22px;flex:0 0 22px}" +
      ".cf-qr{display:flex;align-items:center;gap:16px;background:#fff;border:2px solid #FFD700;border-radius:18px;padding:12px 18px;color:#12295e;text-decoration:none;text-align:left}" +
      ".cf-qr img{width:130px;height:auto;border-radius:12px;display:block}" +
      ".cf-qr b{display:block;font-size:1.05rem}" +
      ".cf-qr span{display:block;font-size:.88rem;color:#5b6784;word-break:break-all;max-width:210px}" +
      "@media(max-width:600px){.cf-qr{flex-direction:column;text-align:center}.cf-qr span{max-width:none}}";
    document.head.appendChild(s);
  }

  function btn(key, label, href, newTab) {
    var a = document.createElement("a");
    a.className = "cf-btn";
    a.href = href;
    if (newTab) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    a.innerHTML = ICON[key] + "<span></span>";
    a.lastChild.textContent = label;
    return a;
  }

  function addContact() {
    if (document.querySelector(".cf-wrap")) return;
    var host = document.querySelector("footer");
    if (!host) return;
    css();
    var wrap = document.createElement("div");
    wrap.className = "cf-wrap";
    wrap.id = "contact";
    wrap.innerHTML = '<div class="cf-title">Connect With Us</div><div class="cf-sub">Follow the Java Skill Bee Club and reach out to us.</div>';
    var row = document.createElement("div");
    row.className = "cf-row";
    row.appendChild(btn("linkedin", "LinkedIn", LINKS.linkedin, true));
    row.appendChild(btn("youtube", "YouTube", LINKS.youtube, true));
    row.appendChild(btn("email", "javaskillbees@gmail.com", LINKS.email, false));
    row.appendChild(btn("instagram", "Instagram", LINKS.instagram, true));

    var qr = document.createElement("a");
    qr.className = "cf-qr";
    qr.href = LINKS.instagram;
    qr.target = "_blank";
    qr.rel = "noopener noreferrer";
    var img = document.createElement("img");
    img.src = QR;
    img.alt = "Instagram QR code";
    img.loading = "lazy";
    var txt = document.createElement("div");
    txt.innerHTML = "<b>Scan to follow on Instagram</b><span>@java_skillbee_club_vmkvec</span>";
    qr.appendChild(img);
    qr.appendChild(txt);
    row.appendChild(qr);

    wrap.appendChild(row);
    host.insertBefore(wrap, host.firstChild);
  }

  function swapLogos() {
    css();
    Array.prototype.forEach.call(document.querySelectorAll(".hero-logo, .brand img"), function (im) {
      if (im.getAttribute("data-cf") === "1") return;
      im.setAttribute("data-cf", "1");
      im.src = LOGO;
    });
  }

  function run() { swapLogos(); addContact(); }
  function start() {
    run();
    var n = 0;
    var t = setInterval(function () { run(); if (++n > 20) clearInterval(t); }, 500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  window.addEventListener("hashchange", function () { setTimeout(run, 200); });
})();