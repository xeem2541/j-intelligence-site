  // uses: WAI-ARIA tabs (arrow keys / Home / End); the shown panel replays its chat
  const utabs = [...document.querySelectorAll(".utab")];
  const uselect = t => utabs.forEach(x => {
    const on = x === t, pnl = document.getElementById(x.getAttribute("aria-controls"));
    x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1;
    pnl.hidden = !on; pnl.classList.toggle("on", on);
  });
  utabs.forEach((t, i) => {
    t.addEventListener("click", () => uselect(t));
    t.addEventListener("keydown", e => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      const n = k ? utabs[(i + k + utabs.length) % utabs.length] : e.key === "Home" ? utabs[0] : e.key === "End" ? utabs[utabs.length - 1] : null;
      if (n) { uselect(n); n.focus(); e.preventDefault(); }
    });
  });

  // calculator: hours spent on chats per month, the share the bot could take, and that time's value
  const cv = id => +document.getElementById(id).value, nf = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 1 });
  const calc = () => {
    const chats = cv("cChats"), min = cv("cMin"), share = cv("cShare") / 100, wage = cv("cWage");
    const total = chats * min * 30 / 60, saved = total * share;
    document.getElementById("cvChats").textContent = chats; document.getElementById("cvMin").textContent = min;
    document.getElementById("cvShare").textContent = Math.round(share * 100) + "%"; document.getElementById("cvWage").textContent = wage;
    document.getElementById("coTotal").textContent = nf.format(total) + " ชม./เดือน";
    document.getElementById("coSaved").textContent = nf.format(saved) + " ชม./เดือน";
    document.getElementById("coMoney").textContent = "≈ ฿" + Math.round(saved * wage).toLocaleString("th-TH") + "/เดือน";
  };
  document.getElementById("calcForm").addEventListener("input", calc); calc();

  // nav: mark the link of the section that fills the middle of the screen
  const navLinks = [...document.querySelectorAll("#links a")];
  const nio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => a.getAttribute("href").endsWith("#" + e.target.id) ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["services", "work", "pricing", "faq"].forEach(id => nio.observe(document.getElementById(id)));
  ["top", "uses", "calc", "process", "trust", "contact"].forEach(id => { const el = document.getElementById(id); if (el) new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.removeAttribute("aria-current")); }), { rootMargin: "-45% 0px -50% 0px" }).observe(el); });

