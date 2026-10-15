/* winners-fix.js - Events section as one row, 3 photos visible, auto-scrolling right to left.
   Reads the Activity_Winners folder; new images appear automatically (re-checked every 4 seconds). */
(function () {
  var FOLDER = "Activity_Winners/";
  var HEADING = /winners/i;
  var POLL_MS = 4000;
  var SLIDE_MS = 3500;
  var IMG_RE = /\.(jpe?g|png|gif|webp|avif|bmp)$/i;

  var last = "";
  var index = 0;
  var timer = null;
  var paused = false;
  var count = 0;

  function css() {
    if (document.getElementById("wf-style")) return;
    var s = document.createElement("style");
    s.id = "wf-style";
    s.textContent =
      ".wf-wrap{--w:300px;--gap:22px;position:relative;margin:28px 0;overflow:hidden;padding:18px 0;border-radius:18px;background:#fff;box-shadow:0 6px 24px rgba(0,0,0,.12);border-bottom:5px solid #d4af37}" +
      ".wf-track{display:flex;width:max-content;animation:wf-scroll var(--dur,40s) linear infinite;will-change:transform}" +
      ".wf-wrap:hover .wf-track{animation-play-state:paused}" +
      ".wf-item{flex:0 0 var(--w);width:var(--w);margin-right:var(--gap);position:relative;height:min(60vh,430px);display:flex;align-items:center;justify-content:center;background:#fff;border:2px solid #d4af37;border-radius:12px;overflow:hidden;cursor:zoom-in}" +
      ".wf-bg{position:absolute;inset:-20px;background-size:cover;background-position:center;filter:blur(16px) brightness(.9);transform:scale(1.1)}" +
      ".wf-item img{position:relative;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block}" +
      "@keyframes wf-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}" +
      "@media(prefers-reduced-motion:reduce){.wf-track{animation:none}.wf-wrap{overflow-x:auto}}" +
      ".wf-empty{padding:24px;color:#777}" +
      ".wf-box{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:9999;cursor:zoom-out}" +
      ".wf-box img{max-width:92vw;max-height:92vh;border-radius:8px}";
    document.head.appendChild(s);
  }

  function natural(a, b) {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  }

  function listFromFolder() {
    return fetch(FOLDER, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("no listing"); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var out = [];
        Array.prototype.forEach.call(doc.querySelectorAll("a[href]"), function (a) {
          var href = a.getAttribute("href") || "";
          var name = decodeURIComponent(href.split("?")[0].split("/").pop());
          if (IMG_RE.test(name) && out.indexOf(name) < 0) out.push(name);
        });
        if (!out.length) throw new Error("empty listing");
        return out.sort(natural);
      });
  }

  function exists(url) {
    return new Promise(function (res) {
      var i = new Image();
      i.onload = function () { res(true); };
      i.onerror = function () { res(false); };
      i.src = url + "?t=" + Date.now();
    });
  }
  function listByProbe() {
    var exts = ["jpeg", "jpg", "png", "JPG", "JPEG", "PNG", "webp"];
    var found = [];
    function tryNum(n) {
      if (n > 60) return Promise.resolve(found);
      var chain = Promise.resolve(null);
      exts.forEach(function (e) {
        chain = chain.then(function (hit) {
          if (hit) return hit;
          var name = n + "." + e;
          return exists(FOLDER + name).then(function (ok) { return ok ? name : null; });
        });
      });
      return chain.then(function (hit) {
        if (!hit) return found;
        found.push(hit);
        return tryNum(n + 1);
      });
    }
    return tryNum(1);
  }

  function getList() {
    return Promise.resolve([
        "1st_event.jpeg",
        "Screenshot 2026-10-14 154630.png",
        "Screenshot 2026-10-14 154717.png",
        "Screenshot 2026-10-14 154733.png",
        "Screenshot 2026-10-14 154748.png",
        "Screenshot 2026-10-14 154817.png"
    ]);
}

  function findSection() {
    var h = Array.prototype.slice.call(document.querySelectorAll("h1,h2,h3"))
      .filter(function (x) { return HEADING.test(x.textContent); })[0];
    if (!h) return null;
    return { h: h, sec: h.closest("section") || h.parentElement };
  }

  function perView() {
    var w = window.innerWidth;
    return w < 700 ? 1 : (w < 1000 ? 2 : 3);
  }

  function sizeWrap(wrap) {
    var n = perView(), gap = 22;
    var w = (wrap.clientWidth - gap * n) / n;
    wrap.style.setProperty("--w", Math.max(160, w) + "px");
    wrap.style.setProperty("--gap", gap + "px");
  }

  function openBox(url) {
    var box = document.createElement("div");
    box.className = "wf-box";
    var big = document.createElement("img");
    big.src = url;
    box.appendChild(big);
    box.addEventListener("click", function () { box.remove(); });
    document.body.appendChild(box);
  }

  function render(files) {
    var f = findSection();
    if (!f) return;
    css();
    var sec = f.sec, h = f.h;
    var old = sec.querySelector(".wf-wrap, .wf-empty");

    if (!old) {
      var seen = false;
      Array.prototype.slice.call(sec.children).forEach(function (k) {
        if (k === h || k.contains(h)) { seen = true; return; }
        if (seen) k.remove();
      });
      if (h.parentElement !== sec) {
        var sib = h.parentElement.nextSibling;
        while (sib) { var n = sib.nextSibling; if (sib.nodeType === 1) sib.remove(); sib = n; }
      }
    } else {
      old.remove();
    }

    if (!files.length) {
      var e = document.createElement("div");
      e.className = "wf-empty";
      e.textContent = "No winner photos yet. Add images to the Activity_Winners folder.";
      sec.appendChild(e);
      return;
    }

    // one half must be wider than the view, so repeat the list if there are few photos
    var half = files.slice();
    while (half.length < 4) half = half.concat(files);
    var all = half.concat(half);

    var wrap = document.createElement("div");
    wrap.className = "wf-wrap";
    var track = document.createElement("div");
    track.className = "wf-track";
    all.forEach(function (name) {
      var url = FOLDER + encodeURIComponent(name);
      var item = document.createElement("div");
      item.className = "wf-item";
      var bg = document.createElement("div");
      bg.className = "wf-bg";
      bg.style.backgroundImage = "url(\"" + url + "\")";
      item.appendChild(bg);
      var img = document.createElement("img");
      img.src = url;
      img.alt = "Contest winner";
      item.appendChild(img);
      item.addEventListener("click", function () { openBox(url); });
      track.appendChild(item);
    });
    wrap.appendChild(track);
    track.style.setProperty("--dur", (half.length * 6) + "s");
    sec.appendChild(wrap);
    sizeWrap(wrap);
  }

  // identical pictures saved under different names are shown only once
  var hashCache = {};
  function hashOf(name) {
    if (hashCache[name]) return hashCache[name];
    hashCache[name] = fetch(FOLDER + encodeURIComponent(name), { cache: "no-store" })
      .then(function (r) { return r.arrayBuffer(); })
      .then(function (buf) {
        if (!window.crypto || !crypto.subtle) return name;
        return crypto.subtle.digest("SHA-1", buf).then(function (d) {
          return Array.prototype.map.call(new Uint8Array(d), function (x) {
            return ("0" + x.toString(16)).slice(-2);
          }).join("");
        });
      })
      .catch(function () { return name; });
    return hashCache[name];
  }
  function unique(files) {
    return Promise.all(files.map(hashOf)).then(function (hashes) {
      var seen = {}, out = [];
      files.forEach(function (n, i) {
        if (!seen[hashes[i]]) { seen[hashes[i]] = 1; out.push(n); }
      });
      return out;
    });
  }

  function check() {
    getList().then(unique).then(function (files) {
      var key = files.join("|");
      var f = findSection();
      var missing = f && !f.sec.querySelector(".wf-wrap, .wf-empty");
      if (key !== last || missing) {
        last = key;
        render(files);
      }
    }).catch(function () {});
  }

  function start() {
    check();
    setTimeout(check, 500);
    setTimeout(check, 1500);
    setInterval(check, POLL_MS);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  window.addEventListener("resize", function () { var w = document.querySelector(".wf-wrap"); if (w) sizeWrap(w); });
  window.addEventListener("hashchange", function () { setTimeout(check, 200); });
})();