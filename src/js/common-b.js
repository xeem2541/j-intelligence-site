  // site assistant: answers from the facts on this page (no AI, no server, no cost).
  // Each topic lists Thai/English cue words; the topic with the highest score answers (narrow FAQ topics weigh 3x).
  // Only Fastwork addresses in an answer become links; everything else is inserted as plain text
  const fab = document.getElementById("jbotFab"), bPanel = document.getElementById("jbotPanel"), bLog = document.getElementById("jbotLog");
  const bForm = document.getElementById("jbotForm"), bIn = document.getElementById("jbotIn"), bSugg = document.getElementById("jbotSugg");
  const FW = "https://fastwork.com/user/jakkarin.dev";
  const bTopics = [
    { cues: ["แชทบอท", "chatbot", "บอท", "3,500", "3500", "ช่องทาง", "line", "ไลน์", "facebook", "เฟส", "messenger"],
      a: `AI Chatbot ร้านค้า เริ่มต้น ฿3,500 ครับ ราคาเริ่มต้นเลือกได้ 1 ช่องทาง: เว็บไซต์ LINE OA หรือ Facebook สอนบอทด้วยข้อมูลร้านคุณ เรื่องที่ตอบไม่ได้ส่งต่อให้แอดมิน และดูแลหลังส่งงาน 30 วันครับ` },
    { cues: ["เว็บไซต์", "เว็บ", "website", "8,900", "8900", "responsive", "หน้าเว็บ"],
      a: `เว็บไซต์ + AI เริ่มต้น ฿8,900 ครับ เว็บร้านค้าหรือธุรกิจที่ดูดีทุกหน้าจอ พร้อมผู้ช่วย AI ในหน้าเว็บ เพิ่มเครื่องมือ AI ตามที่ธุรกิจต้องการ สอนใช้งานและส่งมอบโค้ดให้ครับ` },
    { cues: ["คอนเทนต์", "content", "โพสต์", "แคปชัน", "แคปชั่น", "caption", "990", "เพจ", "ภาพประกอบ", "แฮชแท็ก"],
      a: `คอนเทนต์ AI เริ่มต้น ฿990 / 10 โพสต์ครับ แคปชันขายของพร้อมแฮชแท็กในน้ำเสียงของแบรนด์คุณ ภาพประกอบจาก AI และแก้ไขได้ 2 ครั้งครับ` },
    { w: 3, cues: ["รายเดือน", "ค่า ai", "ค่าai", "ค่าใช้จ่าย", "จ่ายเพิ่ม", "ค่าเพิ่ม", "ต่อเดือน", "monthly"],
      a: `ค่า AI รายเดือนจ่ายตามการใช้งานจริง ตรงกับผู้ให้บริการในชื่อคุณเองครับ ผมไม่เก็บค่ารายเดือนเพิ่ม และแจ้งค่าใช้จ่ายรายเดือนล่วงหน้าตั้งแต่ตอนปรึกษาครับ` },
    { w: 3, cues: ["ไม่มีเว็บ"],
      a: `ได้ครับ ใช้ผ่าน LINE OA อย่างเดียวได้ หรือผมทำหน้าเว็บหน้าเดียวสำหรับบอทให้ ทั้งสองแบบแจ้งราคารวมก่อนเริ่มงาน ไม่มีค่าใช้จ่ายเพิ่มทีหลัง นอกจากค่า AI ตามการใช้งานจริงครับ` },
    { w: 3, cues: ["มั่ว", "ตอบผิด", "แม่น", "ตอบไม่ได้", "ไม่รู้"],
      a: `บอทถูกตั้งให้ตอบจากข้อมูลที่คุณให้เท่านั้นครับ ถ้าไม่รู้จะบอกให้ติดต่อแอดมิน และคุณได้ลองคุยกับเดโมก่อนส่งงานจริงทุกครั้งครับ` },
    { w: 4, cues: ["แก้ข้อมูล", "เปลี่ยนราคา", "เมนู", "อัปเดต", "อัพเดท", "แก้เอง", "เปลี่ยนเอง"],
      a: `เปลี่ยนเองได้ครับ ผมทำไฟล์ข้อมูลที่แก้ง่ายพร้อมคู่มือให้ ไม่ต้องเขียนโค้ดครับ` },
    { w: 3, cues: ["ขั้นตอน", "เริ่มยังไง", "เริ่มต้นยังไง", "ทำงานยังไง", "process", "ทดลอง", "ปรึกษา"],
      a: `ขั้นตอนมี 4 ขั้นครับ 1) ปรึกษาฟรี เล่าธุรกิจให้ฟังแล้วผมแนะนำแบบที่เหมาะ พร้อมแจ้งค่าใช้จ่ายรายเดือนล่วงหน้า 2) ออกแบบเฉพาะธุรกิจคุณ 3) ทดลองใช้ก่อนส่งมอบ ปรับจนพอใจ 4) ระบบเป็นของคุณ 100% บัญชีและโฮสติ้งในชื่อคุณ พร้อมคู่มือครับ` },
    { w: 3, cues: ["เป็นของ", "เจ้าของ", "โฮสติ้ง", "hosting", "บัญชี", "โค้ด"],
      a: `ระบบเป็นของคุณ 100% ครับ บัญชีและโฮสติ้งอยู่ในชื่อคุณ พร้อมคู่มือการใช้งานครับ` },
    { w: 3, cues: ["ดูแล", "หลังส่ง", "ซัพพอร์ต", "support", "ประกัน"],
      a: `แพ็กเกจ AI Chatbot มีดูแลหลังส่งงาน 30 วันครับ ส่วนบริการอื่นคุยรายละเอียดได้ใน Fastwork ครับ ${FW}` },
    { w: 3, cues: ["ผลงาน", "ตัวอย่าง", "ลินินดี", "ร่มเงา", "portfolio"],
      a: `ผลงานบนหน้านี้ ลินินดี (ร้านเสื้อผ้าลินิน) และร่มเงา (โบรกเกอร์ประกันภัย) เป็นแบรนด์สมมติที่ผมออกแบบเพื่อแสดงสิ่งที่ร้านคุณจะได้รับครับ ไม่ใช่ลูกค้าจริงครับ` },
    { w: 3, cues: ["กี่วัน", "นานไหม", "ระยะเวลา", "เสร็จเมื่อไหร่", "ใช้เวลา", "ด่วน"],
      a: `แพ็กเกจเริ่มต้นใช้เวลาประมาณ คอนเทนต์ AI 3 วัน, AI Chatbot 5 วัน และเว็บไซต์ + AI 7 วันครับ งานที่ใหญ่กว่านี้ผมแจ้งระยะเวลาให้ชัดเจนก่อนเริ่มงาน ทักคุยรายละเอียดได้ที่ ${FW}` },
    { w: 3, cues: ["แก้ไข", "แก้กี่ครั้ง", "แก้งาน", "revision"],
      a: `แพ็กเกจเริ่มต้นแก้ไขได้ 2 ครั้งครับ สำหรับแชทบอท คุณได้ลองคุยกับเดโมและปรับจนพอใจก่อนส่งมอบด้วยครับ` },
    { w: 3, cues: ["จ่ายเงิน", "ชำระ", "จ่ายยังไง", "โอนเงิน", "มัดจำ", "โกง"],
      a: `จ้างและชำระเงินผ่าน Fastwork ครับ เงินจะยังไม่ถึงผมจนกว่าคุณกดรับมอบงาน และถ้ามีปัญหา Fastwork มีขั้นตอนไกล่เกลี่ยให้ทั้งสองฝ่ายครับ ${FW}` },
    { w: 3, cues: ["ปลอดภัย", "ความเป็นส่วนตัว", "รหัสผ่าน", "สิทธิ์แอดมิน", "ข้อมูลรั่ว"],
      a: `ระบบและบัญชีอยู่ในชื่อคุณทั้งหมดครับ บอทตอบจากข้อมูลที่คุณให้เท่านั้น และผมแนะนำวิธีให้สิทธิ์แอดมิน LINE OA หรือเพจอย่างปลอดภัย ส่วนการจ่ายเงินทำผ่าน Fastwork เงินถึงผมเมื่อคุณกดรับมอบงานครับ` },
    { w: 3, cues: ["เตรียม", "ต้องใช้อะไร", "ต้องส่งอะไร", "ข้อมูลอะไร"],
      a: `สำหรับแชทบอท เตรียมข้อมูลร้าน (เวลาเปิดปิด วิธีสั่งซื้อและจัดส่ง) รายการสินค้าหรือเมนูพร้อมราคา คำถามที่ลูกค้าถามบ่อย (ถ้ามี) และโลโก้กับสีร้านครับ ถ้าใช้บน LINE OA หรือ Facebook ผมจะแนะนำวิธีให้สิทธิ์แอดมินอย่างปลอดภัยครับ` },
    { w: 3, cues: ["ส่วนลด", "ลดราคา", "โปร", "ต่อรอง"],
      a: `ราคาบนหน้านี้เป็นราคาเริ่มต้นและปรับตามขอบเขตงานจริงครับ ทักมาคุยรายละเอียดใน Fastwork ได้เลยครับ ${FW}` },
    { cues: ["ติดต่อ", "จ้าง", "สั่ง", "คุยต่อ", "fastwork", "ทัก", "เบอร์", "อีเมล", "email"],
      a: `ทักคุยและจ้างงานผ่าน Fastwork ได้เลยครับ ปรึกษาฟรีก่อนจ้าง ${FW}` },
    { cues: ["บริการ", "ทำอะไร", "มีอะไรบ้าง", "service", "รับทำ"],
      a: `มี 3 บริการครับ AI Chatbot ร้านค้า เริ่มต้น ฿3,500 · เว็บไซต์ + AI เริ่มต้น ฿8,900 · คอนเทนต์ AI เริ่มต้น ฿990 / 10 โพสต์ อยากรู้รายละเอียดบริการไหน ถามต่อได้เลยครับ` },
    { cues: ["ราคา", "เท่าไหร่", "เท่าไร", "กี่บาท", "ค่าบริการ", "price"],
      a: `ราคาเริ่มต้นครับ AI Chatbot ฿3,500 · เว็บไซต์ + AI ฿8,900 · คอนเทนต์ AI ฿990 / 10 โพสต์ ราคาปรับตามขอบเขตงานจริง และค่า AI รายเดือนจ่ายตามการใช้งานจริงในชื่อคุณครับ` },
    { cues: ["สวัสดี", "หวัดดี", "hello", "hi", "ดีครับ", "ดีค่ะ"],
      a: `สวัสดีครับ ถามเรื่องบริการ ราคา ค่ารายเดือน หรือขั้นตอนทำงานได้เลยครับ` }
  ];
  const bUnknown = `ข้อนี้ผมยังไม่มีข้อมูลบนหน้านี้ครับ ผู้ช่วยตอบได้เรื่องบริการ ราคา ค่ารายเดือน และขั้นตอนทำงาน เรื่องอื่นทักคุยกับผมโดยตรงใน Fastwork ได้เลยครับ ${FW}`;
  const bAnswer = q => {
    const t = q.toLowerCase().replace(/\s+/g, " ");
    let best = null, top = 0;
    bTopics.forEach(x => { const n = x.cues.filter(c => t.includes(c)).length * (x.w || 1); if (n > top) { top = n; best = x; } });
    return best ? best.a : bUnknown;
  };
  let bWaiting = false;
  const bOpen = (on, refocus = true) => {
    bPanel.classList.toggle("open", on); fab.setAttribute("aria-expanded", String(on)); root.classList.toggle("jbot-on", on);
    if (on) setTimeout(() => bIn.focus(), 60); else if (refocus) fab.focus();
  };
  const bAdd = (who, text) => {
    const m = document.createElement("div"); m.className = "m " + who;
    text.split(/(https:\/\/fastwork\.com\/[\w./-]*[\w/])/).forEach((part, i) => {
      if (i % 2) { const a = document.createElement("a"); a.href = part; a.target = "_blank"; a.rel = "noopener"; a.textContent = "Fastwork"; a.setAttribute("aria-label", "Fastwork (เปิดในแท็บใหม่)"); m.append(a); }
      else if (part) m.append(part);
    });
    bLog.append(m); bLog.scrollTop = bLog.scrollHeight; return m;
  };
  const bAsk = q => {
    q = q.trim().slice(0, 600);
    if (!q || bWaiting) return;
    bWaiting = true; bForm.setAttribute("aria-busy", "true"); bSugg.hidden = true; bIn.value = "";
    bAdd("cu", q);
    const reply = bAnswer(q);
    const done = () => { dots && dots.remove(); bAdd("ai", reply); bWaiting = false; bForm.removeAttribute("aria-busy"); bIn.focus(); };
    if (root.classList.contains("rm")) { var dots = null; done(); return; }
    var dots = document.createElement("div"); dots.className = "m ai typing on"; dots.setAttribute("aria-hidden", "true"); dots.innerHTML = "<i></i><i></i><i></i>";
    bLog.append(dots); bLog.scrollTop = bLog.scrollHeight;
    setTimeout(done, 650);
  };
  fab.addEventListener("click", () => bOpen(true));
  document.getElementById("jbotClose").addEventListener("click", () => bOpen(false));
  bPanel.addEventListener("keydown", e => { if (e.key === "Escape") bOpen(false); });
  bForm.addEventListener("submit", e => { e.preventDefault(); bAsk(bIn.value); });
  bSugg.querySelectorAll("button").forEach(b => b.addEventListener("click", () => bAsk(b.textContent)));

  // Netlify's free plan injects a "Powered by Netlify" badge (fixed iframe, bottom right, top z-index).
  // Keep our fixed controls clickable: expose its height as --nlb and lift them above it (transform, so nothing shifts)
  const nlBadge = () => {
    const f = document.getElementById("nl-badge-frame"), r = f && f.getBoundingClientRect();
    root.style.setProperty("--nlb", r && r.height && r.bottom >= innerHeight - 2 ? Math.round(r.height) + "px" : "0px");
  };
  new MutationObserver(() => { nlBadge(); setTimeout(nlBadge, 800); }).observe(document.body, { childList: true });
  addEventListener("resize", nlBadge); nlBadge();

  // light sections: two brand glows each (a big one and a small one drifting the other way) and a few AI sparks
  // at three depths along the edges, all moved by transform as the section passes (visible sections only)
  const depth = [...document.querySelectorAll("section.s")].map((sec, i) => {
    const side = i % 2 ? " r" : "", items = [];
    const add = (el, k, kx) => { el.setAttribute("aria-hidden", "true"); sec.prepend(el); items.push({ el, k, kx }); };
    const g1 = document.createElement("div"); g1.className = "s-glow" + side; add(g1, 120, i % 2 ? -40 : 40);
    const g2 = document.createElement("div"); g2.className = "s-glow b" + side; add(g2, -70, i % 2 ? 25 : -25);
    const n = innerWidth < 768 ? 3 : 6;
    for (let j = 0; j < n; j++) {
      const r = (k => (Math.sin(i * 97 + j * 31 + k) * 10000) % 1)(1), r2 = Math.abs((Math.sin(i * 53 + j * 17) * 10000) % 1);
      const d = [0.35, 0.7, 1.1][j % 3];
      const sp = document.createElement("span"); sp.className = "s-spark"; sp.append(document.createElement("i"));
      const leftSide = (j + i) % 2 === 0;
      sp.style.cssText = `${leftSide ? "left" : "right"}:${(2 + Math.abs(r) * 9).toFixed(1)}%;top:${(8 + r2 * 80).toFixed(1)}%;--z:${Math.round(6 + d * 10)}px;--o:${(0.25 + d * 0.3).toFixed(2)};--tw:${(3.5 + r2 * 3).toFixed(1)}s`;
      add(sp, 260 * d, 0);
    }
    return { sec, items, on: false };
  });
  const sprog = document.getElementById("sprog"), stepsEl = document.getElementById("steps");
  let dq = false;
  const onScroll = () => {
    dq = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    sprog.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0})`;
    if (stepsEl) {
      const sr = stepsEl.getBoundingClientRect();
      stepsEl.style.setProperty("--sl", Math.min(1, Math.max(0, (innerHeight * 0.85 - sr.top) / (innerHeight * 0.55))).toFixed(3));
    }
    if (root.classList.contains("rm")) return;
    depth.forEach(o => {
      if (!o.on) return;
      const r = o.sec.getBoundingClientRect(), t = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      o.items.forEach(it => { it.el.style.transform = `translate3d(${(t * it.kx).toFixed(1)}px,${(t * it.k).toFixed(1)}px,0)`; });
    });
  };
  const gio = new IntersectionObserver(es => es.forEach(e => { depth.find(o => o.sec === e.target).on = e.isIntersecting; }) || onScroll(), { rootMargin: "20% 0px" });
  depth.forEach(o => gio.observe(o.sec));
  addEventListener("scroll", () => { if (!dq) { dq = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  // price and work cards: lean up to 4 degrees toward the mouse with a soft light under it (fine pointers only)
  if (fine && !still) document.querySelectorAll(".tier:not(.feat), .tier.feat, .work").forEach(c => {
    c.addEventListener("pointermove", e => {
      const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
      const m = Math.hypot(x, y) || 1;
      c.style.rotate = `${(-y / m).toFixed(3)} ${(x / m).toFixed(3)} 0 ${(Math.min(1, m * 2) * 4).toFixed(2)}deg`;
      c.style.setProperty("--sx", Math.round(e.clientX - b.left) + "px"); c.style.setProperty("--sy", Math.round(e.clientY - b.top) + "px");
      c.classList.add("lit");
    });
    c.addEventListener("pointerleave", () => { c.style.rotate = ""; c.classList.remove("lit"); });
  });

