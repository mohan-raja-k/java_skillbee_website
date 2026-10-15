/* home-fix.js - Home banner college name: two lines, no "Salem - 636308", clearly visible colour */
(function () {
  var LINE1 = "VINAYAKA MISSION'S KIRUPANANDA VARIYAR ENGINEERING COLLEGE";
  var LINE2 = "SCHOOL OF COMPUTER SCIENCE";

  function css() {
    if (document.getElementById("hf-style")) return;
    var s = document.createElement("style");
    s.id = "hf-style";
    s.textContent =
      "body .hf-college{display:inline-block;max-width:900px;margin:0 auto;padding:14px 26px;border-radius:14px;" +
      "background:rgba(6,16,44,.72);border:2px solid #FFD700;color:#fff;font-weight:700;letter-spacing:.03em;line-height:1.35;" +
      "text-shadow:0 2px 6px rgba(0,0,0,.7);font-size:clamp(1rem,2.2vw,1.45rem)}" +
      "body .hf-college .hf-l2{display:block;margin-top:6px;color:#FFD700;font-size:1.1em;letter-spacing:.08em}";
    document.head.appendChild(s);
  }

  function findEl() {
    var el = document.querySelector(".college");
    if (el) return el;
    var all = document.querySelectorAll("p,div,span,h2,h3");
    var best = null;
    for (var i = 0; i < all.length; i++) {
      var t = all[i].textContent || "";
      if (/KIRUPANANDA/i.test(t) && t.length < 300) {
        if (!best || t.length < best.textContent.length) best = all[i];
      }
    }
    return best;
  }

  function fix() {
    var el = findEl();
    if (!el || el.getAttribute("data-hf") === "1") return;
    css();
    el.setAttribute("data-hf", "1");
    el.className = (el.className ? el.className + " " : "") + "hf-college";
    el.innerHTML = "";
    el.appendChild(document.createTextNode(LINE1));
    var l2 = document.createElement("span");
    l2.className = "hf-l2";
    l2.textContent = LINE2;
    el.appendChild(l2);
  }

  function run() { fix(); setTimeout(fix, 300); setTimeout(fix, 1000); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
  // if the page re-renders the text, apply again
  new MutationObserver(function () {
    var el = document.querySelector(".hf-college");
    if (!el || !/SCHOOL OF COMPUTER/i.test(el.textContent) || /636308/.test(el.textContent)) {
      var old = document.querySelector("[data-hf]");
      if (old) old.removeAttribute("data-hf");
      fix();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();