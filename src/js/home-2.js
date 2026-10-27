  // hero chat: messages play in order, and the AI shows "typing" dots before every reply.
  // wantN = how many should be on screen (a timer on small screens, the scroll on desktop); the player catches up one at a time
  const msgs = [...hero.querySelectorAll(".cw-log .m:not(.typing)")];
  const botDots = document.getElementById("botTyping");
  const showAt = [0, .16, .34, .52];
  let shownN = 0, wantN = 0, busy = null;
  const play = () => {
    if (busy || root.classList.contains("rm")) return;
    while (shownN > wantN) msgs[--shownN].classList.remove("shown");
    if (shownN === wantN) { if (shownN === msgs.length) startTyping(1400); return; }
    const m = msgs[shownN];
    const reveal = () => { botDots.classList.remove("on"); m.classList.add("shown"); shownN++; busy = setTimeout(() => { busy = null; play(); }, 450); };
    if (m.classList.contains("ai")) {
      botDots.style.setProperty("--ty", m.offsetTop + "px");
      botDots.classList.add("on");
      busy = setTimeout(reveal, 950);
    } else reveal();
  };
  const want = n => {
    if (demo) return;
    if (n <= shownN && busy) { clearTimeout(busy); busy = null; botDots.classList.remove("on"); }
    wantN = n; play();
  };
  if (!root.classList.contains("story")) setTimeout(() => want(msgs.length), 500);
  let ticking = false;
  const onHeroScroll = () => {
    ticking = false;
    if (root.classList.contains("rm")) return;
    const r = hero.getBoundingClientRect();
    const story = root.classList.contains("story");
    const p = story ? Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)))
                    : Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    hero.style.setProperty("--hp", p.toFixed(3));
    if (story) want(showAt.filter(t => p >= t).length);
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onHeroScroll); } }, { passive: true });
  addEventListener("resize", () => {
    const was = root.classList.contains("story");
    root.classList.toggle("story", !root.classList.contains("rm") && matchMedia("(min-width:1024px)").matches);
    if (was && !root.classList.contains("story")) want(msgs.length);
    onHeroScroll();
  });
  if (root.classList.contains("story")) setTimeout(onHeroScroll, 500); else onHeroScroll();

  // hero demo: three ready-made questions; the answers are written here (no API).
  // the question appears, the AI types in the reply's slot, then answers; the live region reads the answer aloud
  const answers = {
    size: { q: "มีไซซ์อะไรบ้างคะ", a: "มี S, M, L และ XL ค่ะ รอบอก 34-46 นิ้ว บอกส่วนสูงกับน้ำหนักมาได้เลย ลินินดีช่วยเลือกไซซ์ให้ค่ะ" },
    ship: { q: "ส่งกี่วันคะ", a: "สั่งก่อนบ่ายสองส่งออกวันนี้ค่ะ กทม. 1-2 วัน ต่างจังหวัด 2-3 วัน แจ้งเลขพัสดุในแชทให้ค่ะ" },
    pay: { q: "จ่ายยังไงได้บ้างคะ", a: "โอนพร้อมเพย์ จ่ายบัตรเครดิต หรือเก็บเงินปลายทางก็ได้ค่ะ ส่งสลิปในแชทแล้วระบบยืนยันให้ทันที" }
  };
  const log = hero.querySelector(".cw-log"), track = log.querySelector(".cw-track"), live = document.getElementById("demoLive");
  const chips = [...hero.querySelectorAll(".chip")];
  let asking = false;
  const fit = () => {
    const cs = getComputedStyle(log), room = log.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const over = track.offsetHeight - room;
    track.style.transform = over > 0 ? `translate3d(0,${-over}px,0)` : "";
  };
  const bubble = (cls, html) => { const m = document.createElement("div"); m.className = "m " + cls; m.innerHTML = html; track.insertBefore(m, typing); return m; };
  const ask = key => {
    if (asking) return;
    const rm = root.classList.contains("rm");
    if (!demo) {
      // take over from the intro: everything shown, the log height locked (same px, so nothing moves)
      demo = true; clearTimeout(busy); busy = null; botDots.classList.remove("on");
      msgs.forEach(m => m.classList.add("shown")); shownN = msgs.length;
      log.style.height = log.offsetHeight + "px"; log.classList.add("demo");
      typing.classList.remove("on"); typing.style.display = "none";
    }
    asking = true; chips.forEach(c => c.setAttribute("aria-disabled", "true"));
    const { q, a } = answers[key];
    const cu = bubble("cu", q);
    const ai = bubble("ai", a + '<small><svg aria-hidden="true"><use href="#check"/></svg>ตอบทันทีโดย AI</small>');
    fit();
    const done = () => {
      botDots.classList.remove("on"); ai.classList.add("shown");
      live.textContent = "ลินินดีตอบ: " + a;
      asking = false; chips.forEach(c => c.removeAttribute("aria-disabled"));
    };
    if (rm) { cu.classList.add("shown"); done(); return; }
    requestAnimationFrame(() => cu.classList.add("shown"));
    setTimeout(() => { botDots.style.setProperty("--ty", ai.offsetTop + "px"); botDots.classList.add("on"); }, 450);
    setTimeout(done, 1500);
  };
  chips.forEach(c => c.addEventListener("click", () => ask(c.dataset.q)));

  // hero depth: with a mouse, the stars, the 02:14 clock and the chat drift at different depths and the chat tilts (max 8°).
  // never on touch screens; eased toward the pointer in rAF so it settles instead of snapping
  const portrait = hero.querySelector(".portrait");
  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !root.classList.contains("rm")) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const clamp = v => Math.max(-1, Math.min(1, v));
    const tick = () => {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      portrait.style.setProperty("--mx", cx.toFixed(4)); portrait.style.setProperty("--my", cy.toFixed(4));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .002 ? requestAnimationFrame(tick) : 0;
    };
    const aim = (x, y) => { tx = x; ty = y; if (!raf) raf = requestAnimationFrame(tick); };
    hero.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      const b = portrait.getBoundingClientRect();
      aim(clamp((e.clientX - b.left - b.width / 2) / (b.width / 2 + 160)), clamp((e.clientY - b.top - b.height / 2) / (b.height / 2 + 120)));
      portrait.classList.add("lit");
    });
    hero.addEventListener("pointerleave", () => { aim(0, 0); portrait.classList.remove("lit"); });
  }

  // hero orb: on desktops with a mouse and motion allowed, three.js is fetched once the page is idle and draws a slowly
  // turning network of particles behind the chat ("Intelligence"); signals run along its links. Everyone else keeps the CSS orb
  const orb = hero.querySelector(".orb");
  if (fine && !still && matchMedia("(min-width:1024px)").matches && "WebGLRenderingContext" in window) {
    const idle = window.requestIdleCallback || (f => setTimeout(f, 200));
    const go = () => import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js").then(T => startOrb(T, orb)).catch(() => {});
    if (document.readyState === "complete") idle(go, { timeout: 2500 }); else addEventListener("load", () => idle(go, { timeout: 2500 }), { once: true });
  }
  function startOrb(T, host) {
    const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    const fit = () => renderer.setSize(host.clientWidth, host.clientWidth, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); fit();
    host.append(renderer.domElement);
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(38, 1, .1, 20);
    cam.position.z = 4.4;

    // points on a sphere (golden spiral, a little jitter), violet at the bottom turning sky toward the top
    const N = 220, pts = [], col = [], violet = new T.Color("#8B5CF6"), sky = new T.Color("#38BDF8");
    for (let i = 0; i < N; i++) {
      const y = 1 - (i + .5) / N * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996, k = 1 + (Math.random() - .5) * .1;
      pts.push(new T.Vector3(Math.cos(a) * r * k, y * k, Math.sin(a) * r * k));
      const c = violet.clone().lerp(sky, (y + 1) / 2); col.push(c.r, c.g, c.b);
    }
    const dot = document.createElement("canvas"); dot.width = dot.height = 64;
    const g = dot.getContext("2d"), rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, "rgba(255,255,255,1)"); rg.addColorStop(.3, "rgba(255,255,255,.75)"); rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
    const sprite = new T.CanvasTexture(dot), glow = { transparent: true, depthWrite: false, blending: T.AdditiveBlending };
    const pg = new T.BufferGeometry().setFromPoints(pts);
    pg.setAttribute("color", new T.Float32BufferAttribute(col, 3));

    // links between near neighbours, kept as a graph so signals can travel from link to link
    const lp = [], lc = [], edges = [], adj = pts.map(() => []);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (pts[i].distanceTo(pts[j]) < .34) {
      edges.push([i, j]); adj[i].push(j); adj[j].push(i);
      lp.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
      lc.push(col[i * 3], col[i * 3 + 1], col[i * 3 + 2], col[j * 3], col[j * 3 + 1], col[j * 3 + 2]);
    }
    const lg = new T.BufferGeometry();
    lg.setAttribute("position", new T.Float32BufferAttribute(lp, 3)); lg.setAttribute("color", new T.Float32BufferAttribute(lc, 3));

    const S = 16, sp = new Float32Array(S * 3), sg = new T.BufferGeometry();
    sg.setAttribute("position", new T.BufferAttribute(sp, 3));
    const signals = Array.from({ length: S }, () => { const e = edges[Math.random() * edges.length | 0]; return { a: e[0], b: e[1], t: Math.random(), v: .7 + Math.random() * .9 }; });

    const net = new T.Group();
    net.add(new T.Points(pg, new T.PointsMaterial({ size: .075, map: sprite, vertexColors: true, ...glow })),
            new T.LineSegments(lg, new T.LineBasicMaterial({ vertexColors: true, opacity: .26, ...glow })),
            new T.Points(sg, new T.PointsMaterial({ size: .13, map: sprite, color: 0xffffff, ...glow })));
    scene.add(net);

    let last = 0, raf = 0, seen = true, spin = 0;
    const frame = now => {
      const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
      spin += dt * .12;
      // the same --mx/--my as the rest of the hero depth: the orb turns a little toward the mouse
      const mx = parseFloat(portrait.style.getPropertyValue("--mx")) || 0, my = parseFloat(portrait.style.getPropertyValue("--my")) || 0;
      net.rotation.set(.35 + my * .18, spin + mx * .3, 0);
      signals.forEach((s, i) => {
        s.t += dt * s.v;
        if (s.t >= 1) { const next = adj[s.b]; if (next.length) { s.a = s.b; s.b = next[Math.random() * next.length | 0]; } else [s.a, s.b] = edges[Math.random() * edges.length | 0]; s.t = 0; }
        const A = pts[s.a], B = pts[s.b];
        sp[i * 3] = A.x + (B.x - A.x) * s.t; sp[i * 3 + 1] = A.y + (B.y - A.y) * s.t; sp[i * 3 + 2] = A.z + (B.z - A.z) * s.t;
      });
      sg.attributes.position.needsUpdate = true;
      renderer.render(scene, cam);
      raf = requestAnimationFrame(frame);
    };
    // draw only while the hero is on screen and the tab is visible
    const run = () => {
      const on = seen && !document.hidden;
      if (on && !raf) { last = 0; raf = requestAnimationFrame(frame); }
      if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    new IntersectionObserver(es => { seen = es[0].isIntersecting; run(); }).observe(host);
    document.addEventListener("visibilitychange", run);
    addEventListener("resize", fit);
    run();
    requestAnimationFrame(() => host.classList.add("live"));
  }

