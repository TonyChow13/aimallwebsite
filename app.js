// ---- mobile nav ----
document.getElementById("navToggle")?.addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

// ---- products dropdown: keep open briefly so you can move to the items ----
document.querySelectorAll(".nav__drop").forEach((drop) => {
  let t;
  drop.addEventListener("mouseenter", () => { clearTimeout(t); drop.classList.add("open"); });
  drop.addEventListener("mouseleave", () => { t = setTimeout(() => drop.classList.remove("open"), 260); });
});
document.querySelectorAll("#navLinks a").forEach(a =>
  a.addEventListener("click", () => document.getElementById("navLinks").classList.remove("open")));

// ---- temporarily disable placeholder links (footer nav columns + case "Read more") ----
document.querySelectorAll(".footer__col a, .story__overlay, .story__all").forEach((el) => {
  const href = el.getAttribute("href") || "";
  if (href.includes("products/")) return;   // product pages are live — keep them clickable
  el.addEventListener("click", (e) => e.preventDefault());
  el.style.cursor = "default";
});

// ---- 5P solutions data (from the live site) ----
const P5 = [
  { title: "Tracking Product within seconds", meta: "REAL-TIME · FMCG & CHAIN STORE",
    chips: [["Facings-per-SKU","FMCG"],["On-shelf-Availability","FMCG"],["POSM","FMCG & CHAIN"],
            ["Price Tag","FMCG & CHAIN"],["Inventory","FMCG & CHAIN"],["Out-of-Stock","CHAIN STORE"],
            ["SKU Placement Error","CHAIN STORE"]] },
  { title: "Serving people by knowing people", meta: "BEHAVIOR · CHAIN STORE",
    chips: [["Customer Insight","CHAIN STORE"],["Heatmap","CHAIN STORE"],["Shoplifting","CHAIN STORE"],
            ["Intruder","CHAIN STORE"],["Queue","CHAIN STORE"],["Uniform","CHAIN STORE"],["Meat Flipping","CHAIN STORE"]] },
  { title: "Avoiding any risk in every place", meta: "SAFETY · CHAIN STORE",
    chips: [["Mouse","CHAIN STORE"],["Garbage","CHAIN STORE"],["Fire & Smoke","CHAIN STORE"],
            ["Cash Room","CHAIN STORE"],["Cart Area","CHAIN STORE"],["Blockage","CHAIN STORE"]] },
  { title: "Following standard operating process", meta: "COMPLIANCE · CHAIN STORE",
    chips: [["Checkout Fraud","CHAIN STORE"],["Checkout Item-Count","CHAIN STORE"],["Checkout Staff-Presence","CHAIN STORE"],
            ["O2O SOPs","CHAIN STORE"],["Customize for Your SOPs","ANY"]] },
  { title: "Evaluating real-time store performance", meta: "ANALYTICS · HQ & STORE",
    chips: [["HQ ChatBI","Talk directly with your data"],["Store Manager Terminal","Track KPI in real time"],
            ["Staff Alert via App/API","Quick corrective actions"]] },
];

const tabs = document.querySelectorAll(".p5__tab");
const titleEl = document.getElementById("p5Title");
const subEl = document.getElementById("p5Sub");
const chipsEl = document.getElementById("p5Chips");

function renderP5(i) {
  const d = P5[i];
  titleEl.textContent = d.title;
  subEl.textContent = d.meta;
  chipsEl.innerHTML = d.chips
    .map(([b, s]) => `<div class="chip"><b>${b}</b><small>${s}</small></div>`)
    .join("");
}
tabs.forEach(t => t.addEventListener("click", () => {
  tabs.forEach(x => x.classList.remove("is-active"));
  t.classList.add("is-active");
  renderP5(+t.dataset.p);
}));
renderP5(0);

// ---- spin-dial product selector ----
const AGENTS = [
  { name: "SnapX",  sub: "Cloud Vision AI",       role: "MARKETING & MERCHANDISING", accent: "c-cyan",
    desc: "Cloud-based AI for fast image, text and video processing — the eyes of the merchandising loop.",
    features: ["Shelf Visibility", "Compliance Assurance", "Flexible Integration", "Action-Driven Rewards"] },
  { name: "EdgeX",  sub: "Edge CCTV AI",           role: "TERMINAL & ENDPOINT EXECUTION", accent: "c-grad",
    desc: "Edge AI for real-time CCTV video analysis and instant on-device response at the endpoint.",
    features: ["Data Collection & Analysis", "Automatic Operation", "Privacy Protection", "Real-time Alerts"] },
  { name: "ChatX",  sub: "Enterprise Copilot",     role: "CONVERSATIONAL ANALYTICS", accent: "c-purple",
    desc: "LLMs integrated directly with your enterprise systems for operational conversation and insight.",
    features: ["Data Visualization", "Natural Language Interaction", "Instant Answer", "Data-based Decision"] },
  { name: "RobotX", sub: "Robot Orchestration",    role: "ROBOT COMMAND CENTER", accent: "c-cyan",
    desc: "The commanding center for robot orchestration — coordinating autonomous fleets across the floor.",
    features: ["Fleet Dispatch", "Task Routing", "Sim2Real Control", "Safety Monitoring"] },
  { name: "FlowX",  sub: "Goods & IoT Workflow",   role: "WORKFLOW ORCHESTRATION", accent: "c-purple",
    desc: "Orchestrates the workflow of goods and IoT — connecting WMS, ERP and devices end to end.",
    features: ["IoT Orchestration", "Goods Tracking", "WMS / ERP Sync", "Process Automation"] },
];

(function initCover() {
  const stage = document.getElementById("coverStage");
  const detail = document.getElementById("prodDetail");
  const idxEl = document.getElementById("coverIdx");
  if (!stage) return;
  const cards = Array.from(stage.querySelectorAll(".cover__card"));
  const N = cards.length;
  let active = 0;

  function render(i) {
    const a = AGENTS[i];
    detail.classList.remove("swap"); void detail.offsetWidth; detail.classList.add("swap");
    detail.innerHTML =
      `<span class="prod-detail__tag mono ${a.accent}">${a.name} · ${a.role}</span>` +
      `<h3 class="prod-detail__name">${a.sub}</h3>` +
      `<p class="prod-detail__desc">${a.desc}</p>` +
      `<ul class="feat">${a.features.map(f => `<li>${f}</li>`).join("")}</ul>` +
      `<a href="#contact" class="link">Learn more about ${a.name} →</a>`;
    idxEl.innerHTML = `<b>${String(i + 1).padStart(2, "0")}</b> / 0${N}`;
  }

  // position each card in 3D relative to the active one
  function layout() {
    cards.forEach((card, i) => {
      let off = i - active;
      if (off > N / 2) off -= N;            // wrap so the carousel is circular
      if (off < -N / 2) off += N;
      const abs = Math.abs(off);
      const x = off * 300;                  // horizontal spread (peeking neighbors)
      const z = -abs * 300;                 // depth
      const rot = off * -38;                // rotateY toward center
      const op = abs > 2 ? 0 : 1 - abs * 0.45;
      card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rot}deg)`;
      card.style.opacity = op;
      card.style.zIndex = String(100 - abs);
      card.style.pointerEvents = abs > 2 ? "none" : "auto";
      card.classList.toggle("is-active", off === 0);
    });
  }
  // play only the active card's video (if it has one), pause the rest
  function updateVideo() {
    cards.forEach((card, i) => {
      const v = card.querySelector("video");
      if (!v) return;
      if (i === active) { v.currentTime = 0; v.play().catch(() => {}); }
      else { v.pause(); }
    });
  }
  function setActive(i) { active = ((i % N) + N) % N; layout(); render(active); updateVideo(); }

  cards.forEach((card, i) => card.addEventListener("click", () => {
    if (stage.dataset.moved === "1") return;
    if (i !== active) setActive(i);
  }));
  document.getElementById("coverPrev").addEventListener("click", () => setActive(active - 1));
  document.getElementById("coverNext").addEventListener("click", () => setActive(active + 1));

  // drag / swipe horizontally
  let down = false, startX = 0;
  stage.addEventListener("pointerdown", (e) => {
    down = true; startX = e.clientX; stage.dataset.moved = "0";
    stage.classList.add("dragging"); stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", (e) => {
    if (!down) return;
    if (Math.abs(e.clientX - startX) > 6) stage.dataset.moved = "1";
  });
  function endDrag(e) {
    if (!down) return;
    down = false; stage.classList.remove("dragging");
    const dx = e.clientX - startX;
    if (dx <= -40) setActive(active + 1);
    else if (dx >= 40) setActive(active - 1);
  }
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", () => { down = false; stage.classList.remove("dragging"); });

  // keyboard arrows
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") setActive(active - 1);
    else if (e.key === "ArrowRight") setActive(active + 1);
  });

  setActive(0);
})();

// ---- success-story showcase: tabs + image + dots + auto-rotate ----
(function initStories() {
  const tabs = Array.from(document.querySelectorAll(".story__tab"));
  const panel = document.getElementById("storyPanel");
  if (!panel) return;
  const ROTATE_MS = 6000;
  const STORIES = [
    { sector: "TOBACCO INDUSTRY",
      title: "90% of tobacco brands in China transform marketing audits — all via AIMALL's AI.",
      desc: "Short description about this case — one or two lines, placeholder for now.",
      img: "assets/case-tobacco.jpg?v=1" },
    { sector: "FMCG & BEVERAGES",
      title: "How FMCG brands stay undefeated in the prime shelf-space battle.",
      desc: "Short description about this case — one or two lines, placeholder for now.",
      img: "assets/case-fmcg.jpg?v=1" },
    { sector: "SUPERMARKET CHAINS",
      title: "Real-time 5P insight fuels smart operations for global retail brands.",
      desc: "Short description about this case — one or two lines, placeholder for now.",
      img: "assets/case-supermarket.jpg?v=1" },
    { sector: "RESTAURANT CHAINS",
      title: "10k+ chain stores master service standardization in 3 months.",
      desc: "Short description about this case — one or two lines, placeholder for now.",
      img: "assets/case-restaurant.jpg?v=1" },
  ];
  const $ = (id) => document.getElementById(id);
  const N = STORIES.length;
  const dotsWrap = document.getElementById("storyDots");
  dotsWrap.innerHTML = STORIES.map((_, i) => `<button class="story__dot" data-i="${i}" aria-label="Story ${i + 1}"></button>`).join("");
  const dots = Array.from(dotsWrap.querySelectorAll(".story__dot"));
  panel.style.setProperty("--rotate", ROTATE_MS + "ms");
  let idx = 0, timer = null, swapT = null, first = true;

  STORIES.forEach(s => { const im = new Image(); im.src = s.img; });  // preload for flash-free fades

  function apply(i) {
    const s = STORIES[i];
    $("stSector").textContent = s.sector;
    $("stTitle").textContent = s.title;
    $("stDesc").textContent = s.desc;
    $("stImg").src = s.img;
    tabs.forEach(t => t.classList.toggle("is-active", +t.dataset.i === i));
    dots.forEach(d => d.classList.remove("is-active"));
    void dotsWrap.offsetWidth;
    dots[i].classList.add("is-active");
  }
  function show(i) {
    if (first) { first = false; apply(i); return; }   // no fade on initial render
    clearTimeout(swapT);
    panel.classList.add("fading");            // dissolve current out
    swapT = setTimeout(() => {
      apply(i);
      panel.classList.remove("fading");       // dissolve new in
    }, 224);
  }
  function go(i, user) { idx = ((i % N) + N) % N; show(idx); if (user) restart(); }
  function restart() { clearInterval(timer); timer = setInterval(() => go(idx + 1, false), ROTATE_MS); }

  tabs.forEach(t => t.addEventListener("click", () => go(+t.dataset.i, true)));
  dots.forEach(d => d.addEventListener("click", () => go(+d.dataset.i, true)));
  document.getElementById("storyPrev")?.addEventListener("click", () => go(idx - 1, true));
  document.getElementById("storyNext")?.addEventListener("click", () => go(idx + 1, true));
  panel.addEventListener("mouseenter", () => clearInterval(timer));
  panel.addEventListener("mouseleave", restart);

  // swipe / drag left-right to change story
  const media = document.getElementById("storyMedia");
  let down = false, startX = 0;
  media?.addEventListener("dragstart", (e) => e.preventDefault());   // stop native image drag
  media?.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button, a")) return;   // let arrows / dots / links get their own clicks
    down = true; startX = e.clientX; media.classList.add("dragging");
    media.setPointerCapture(e.pointerId);
  });
  function endSwipe(e) {
    if (!down) return;
    down = false; media.classList.remove("dragging");
    const dx = e.clientX - startX;
    if (dx <= -45) go(idx + 1, true);
    else if (dx >= 45) go(idx - 1, true);
  }
  media?.addEventListener("pointerup", endSwipe);
  media?.addEventListener("pointercancel", () => { down = false; media.classList.remove("dragging"); });

  go(0, true);
})();

// ---- spotlight glow that follows the cursor on A³V cards ----
document.querySelectorAll(".loop__node").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

// ---- scroll reveal ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll("[data-reveal]").forEach(el => io.observe(el));
