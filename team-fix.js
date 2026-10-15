/* team-fix.js - rebuilds the "Our Team" section using photos from club_members/ */
(function () {
  var FOLDER = "club_members/";
  var EXTS = ["jpeg", "jpg", "png", "JPG", "JPEG", "PNG", "webp"];

  // [photo file name without extension, label shown on card]
  var PHOTOS = [
    ["Club_President", "President"],
    ["Club_President2", "President"],
    ["Vice_President", "Vice President"],
    ["Secretary", "Secretary"],
    ["Joint_Secretary", "Joint Secretary"],
    ["Project_Lead", "Project Lead"],
    ["Technical_Team", "Technical Team"],
    ["Web_development", "Web Development"],
    ["Coding_Competition_Team", "Coding Competition Team"],
    ["Design_Creative_Team", "Design & Creative Team"],
    ["Membership_Coordinator", "Membership Coordinator"],
    ["Publicity_Outreach_Team", "Publicity & Outreach Team"],
    ["Social_Media_Content_Team", "Social Media & Content Team"]
  ];

  // Optional: pair a photo with a person. Key = photo file name, value = name.
  // Example: "Secretary": "Priya S"
  var WHO = {
    "Club_President": "Mohan Raja K",
    "Club_President2": "Saima Brooj S",
    "Vice_President": "Thennarasu A",
    "Secretary": "Pavatharani V",
    "Joint_Secretary": "Rupesh Kumar Patel",
    "Project_Lead": "Monisha S",
    "Technical_Team": "Madhan Raj M",
    "Web_development": "Shivashankari S",
    "Coding_Competition_Team": "Dharani D",
    "Design_Creative_Team": "Yamini R",
    "Membership_Coordinator": "Priya S",
    "Publicity_Outreach_Team": "T. Thanga Tamil Arasu",
    "Social_Media_Content_Team": "Inbalakshmi I"
  };

  var MEMBERS = [
    ["Mohan Raja K", "CSE"], ["Thennarasu A", "CSE"], ["Pavatharani V", "CSE"],
    ["Rupesh Kumar Patel", "CSE"], ["Dharani D", "CSE"], ["Madhan Raj M", "CSE"],
    ["T. Thanga Tamil Arasu", "CSE"],
    ["Priya S", "AI&DS"], ["Yamini R", "AI&DS"], ["Monisha S", "AI&DS"],
    ["Inbalakshmi I", "AI&DS"],
    ["Saima Brooj S", "IT"], ["Shivashankari S", "IT"]
  ];

  function css() {
    var s = document.createElement("style");
    s.textContent =
      ".tf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:24px;margin:28px 0}" +
      ".tf-card{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.1);border-bottom:5px solid #ffd400;text-align:center}" +
      ".tf-card img{width:100%;aspect-ratio:3/4;object-fit:cover;object-position:top;display:block;background:#f3d4d6}" +
      ".tf-body{padding:12px 10px 16px}" +
      ".tf-name{font-weight:700;color:#b30f1b;font-size:1.05rem;margin:0 0 6px}" +
      ".tf-role{display:inline-block;background:#ffd400;color:#7a0a12;font-weight:700;font-size:.85rem;padding:4px 12px;border-radius:999px}" +
      ".tf-role{margin:4px 0}" +
      ".tf-dept{margin-top:6px;font-weight:600;color:#555;font-size:.9rem}" +
      ".tf-sub{margin:36px 0 10px;color:#b30f1b;font-size:1.3rem;font-weight:700}" +
      ".tf-chips{display:flex;flex-wrap:wrap;gap:10px}" +
      ".tf-chip{background:#fff;border:2px solid #ffd400;border-radius:999px;padding:6px 14px;font-weight:600;color:#333}" +
      ".tf-chip b{color:#b30f1b}";
    document.head.appendChild(s);
  }

  function setImg(img, base) {
    var i = 0;
    function next() {
      if (i >= EXTS.length) { img.onerror = null; img.style.visibility = "hidden"; return; }
      img.src = FOLDER + encodeURIComponent(base) + "." + EXTS[i++];
    }
    img.onerror = next;
    next();
  }

  function build() {
    var h = Array.prototype.slice.call(document.querySelectorAll("h1,h2,h3"))
      .filter(function (x) { return /our team/i.test(x.textContent); })[0];
    if (!h) return;
    var sec = h.closest("section") || h.parentElement;
    if (sec.querySelector(".tf-grid")) return;

    var kids = Array.prototype.slice.call(sec.children);
    var seen = false;
    kids.forEach(function (k) {
      if (k === h || k.contains(h)) { seen = true; return; }
      if (seen) k.remove();
    });
    if (h.parentElement !== sec) {
      // heading wrapped in a container: remove its later siblings too
      var sib = h.parentElement.nextSibling;
      while (sib) { var n = sib.nextSibling; if (sib.nodeType === 1) sib.remove(); sib = n; }
    }

    css();
    var grid = document.createElement("div");
    grid.className = "tf-grid";
    PHOTOS.forEach(function (p) {
      var card = document.createElement("div");
      card.className = "tf-card";
      var img = document.createElement("img");
      img.alt = p[1];
      setImg(img, p[0]);
      var body = document.createElement("div");
      body.className = "tf-body";
      var who = WHO[p[0]];
      if (who) {
        var nm = document.createElement("p");
        nm.className = "tf-name";
        nm.textContent = who;
        body.appendChild(nm);
      }
      var role = document.createElement("div");
      role.className = "tf-role";
      role.textContent = p[1];
      body.appendChild(role);
      if (who) {
        var dept = "";
        MEMBERS.forEach(function (m) { if (m[0].toLowerCase() === who.toLowerCase()) dept = m[1]; });
        if (dept) {
          var d = document.createElement("div");
          d.className = "tf-dept";
          d.textContent = "III Year - " + dept;
          body.appendChild(d);
        }
      }
      card.appendChild(img);
      card.appendChild(body);
      grid.appendChild(card);
    });
    sec.appendChild(grid);

  }

  function run() { build(); setTimeout(build, 400); setTimeout(build, 1200); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
  window.addEventListener("hashchange", function () { setTimeout(build, 200); });
})();