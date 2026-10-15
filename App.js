const $ = id => document.getElementById(id);
const norm = s => (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const IMG = window.IMAGES || {main:{},events:[],winners:[],members:[]};
const YEAR = {1:"I Year",2:"II Year",3:"III Year",4:"IV Year"};
const m = IMG.main || {};
const find = k => { const key = Object.keys(m).find(x => norm(x)===norm(k)); return key ? m[key] : ""; };

$("logo").src = $("heroLogo").src = find("club_logo");
document.documentElement.style.setProperty("--bg-img", `url("${find("college_building")}")`);
$("college").textContent = SITE.college;
$("tagline").textContent = SITE.tagline;
$("about").textContent = SITE.about;
$("vision").textContent = SITE.vision;
$("mission").textContent = SITE.mission;
$("pillars").innerHTML = SITE.pillars.map((p,i)=>`<article><h4>${i+1}. ${esc(p.t)}</h4><p>${esc(p.d)}</p></article>`).join("");
$("map").innerHTML = `<thead><tr>${SITE.mapping.head.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${SITE.mapping.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>`;

const initials = n => n.replace(/[^A-Za-z ]/g,"").split(" ").filter(Boolean).map(w=>w[0]).slice(0,2).join("").toUpperCase();
$("leaderList").innerHTML = SITE.leaders.map(l=>{
  const p = find(l.photo);
  return `<article class="leader"><div class="ph">${p?`<img src="${p}" alt="${esc(l.name)}">`:initials(l.name)}</div>
  <div><h3>${esc(l.title)}</h3><p><b>${esc(l.greet)}</b></p><p class="msg">${esc(l.msg)}</p>
  <p class="who">${esc(l.close)}<br>${esc(l.name)}<span>${esc(l.post)}</span></p></div></article>`;
}).join("");

const files = IMG.members || [];
const photoOf = p => { const n = norm(p.name); return files.find(f => { const b = norm(f.split("/").pop().replace(/\.[^.]+$/,"")); return b && (b.includes(n)||n.includes(b)); }) || ""; };
$("teamGrid").innerHTML = MEMBERS.map(p=>{
  const ph = photoOf(p);
  return `<div class="person"><div class="ph">${ph?`<img src="${ph}" alt="${esc(p.name)}" loading="lazy">`:initials(p.name)}</div>
  <div class="info"><h3>${esc(p.name)}</h3>${p.role?`<span class="role">${esc(p.role)}</span>`:""}<span class="sub">${YEAR[p.year]||p.year} - ${esc(p.dept)}</span></div></div>`;
}).join("");

function strip(id, list){
  const el = $(id);
  if(!list.length){ el.innerHTML = '<p class="empty">Photos will appear here after you run the photo scanner.</p>'; return; }
  const imgs = list.map(s=>`<img src="${s}" alt="" loading="lazy">`).join("");
  el.innerHTML = `<div class="track" style="--t:${Math.max(25,list.length*6)}s">${imgs}${imgs}</div>`;
}
strip("eventStrip", IMG.events||[]);
strip("winnerStrip", IMG.winners||[]);

const ids = ["home","vm","leaders","events","winners","team"];
function show(){
  const h = (location.hash||"#home").slice(1);
  const id = ids.includes(h) ? h : "home";
  ids.forEach(s => $(s).style.display = (id==="home"||s===id) ? "" : "none");
  document.querySelectorAll("#menu a").forEach(a => a.classList.toggle("on", a.getAttribute("href")==="#"+id));
  window.scrollTo(0,0);
}
addEventListener("hashchange", show); show();

const lb = $("lb");
document.addEventListener("click", e => {
  if(e.target.closest(".track img")){ lb.querySelector("img").src = e.target.src; lb.classList.add("open"); }
  else if(e.target.closest("#lb")) lb.classList.remove("open");
});
addEventListener("keydown", e => e.key==="Escape" && lb.classList.remove("open"));