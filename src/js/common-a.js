  const root = document.documentElement;
  if (!new URLSearchParams(location.search).get("motion"))
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", e => root.classList.toggle("rm", e.matches));

  // nav turns light once the dark hero has scrolled past
  const nav = document.getElementById("nav"), hero = document.getElementById("top");
  const setNav = () => nav.classList.toggle("light", hero.getBoundingClientRect().bottom < 72);
  addEventListener("scroll", setNav, { passive: true }); setNav();

  // mobile menu
  const menuBtn = document.getElementById("menuBtn"), links = document.getElementById("links");
  const closeMenu = () => { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); };
  menuBtn.addEventListener("click", () => {
    const open = !links.classList.contains("open");
    links.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", String(open));
    if (open) links.querySelector("a,button").focus();
  });
  links.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && links.classList.contains("open")) { closeMenu(); menuBtn.focus(); } });

  // services dropdown: click or keyboard on every device, also opens under a mouse; Escape or a click outside closes it
  const ddBtn = document.getElementById("ddBtn"), dd = ddBtn.parentElement;
  const ddSet = on => ddBtn.setAttribute("aria-expanded", String(on));
  ddBtn.addEventListener("click", () => ddSet(ddBtn.getAttribute("aria-expanded") !== "true"));
  if (matchMedia("(hover:hover) and (pointer:fine) and (min-width:1024px)").matches) {
    let t = 0;
    dd.addEventListener("pointerenter", () => { clearTimeout(t); ddSet(true); });
    dd.addEventListener("pointerleave", () => { t = setTimeout(() => ddSet(false), 180); });
  }
  dd.addEventListener("keydown", e => { if (e.key === "Escape" && ddBtn.getAttribute("aria-expanded") === "true") { ddSet(false); ddBtn.focus(); e.stopPropagation(); } });
  document.addEventListener("click", e => { if (!dd.contains(e.target)) ddSet(false); });
  dd.addEventListener("focusout", e => { if (!dd.contains(e.relatedTarget)) ddSet(false); });
  document.querySelectorAll(".dd-menu a").forEach(a => { if (a.pathname === location.pathname) a.setAttribute("aria-current", "page"); });

  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches, still = root.classList.contains("rm");

  // services bento: a soft light follows the mouse inside each card
  if (fine && !still) document.querySelectorAll(".bcard").forEach(c => {
    c.addEventListener("pointermove", e => {
      const b = c.getBoundingClientRect();
      c.style.setProperty("--sx", Math.round(e.clientX - b.left) + "px"); c.style.setProperty("--sy", Math.round(e.clientY - b.top) + "px");
      c.classList.add("lit");
    });
    c.addEventListener("pointerleave", () => c.classList.remove("lit"));
  });

  // work: each mock-up stands up from its 3D lean once it is well into view
  const wio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("flat"); wio.unobserve(e.target); } }), { threshold: .45 });
  document.querySelectorAll(".work").forEach(w => wio.observe(w));

  // magnetic calls to action: within 32px of the button it leans toward the mouse (6px across, 4px up/down at most)
  if (fine && !still) {
    const mags = [...document.querySelectorAll(".hero-cta .btn-pill, .band .btn-white")];
    mags.forEach(btn => btn.classList.add("mag"));
    let mx = 0, my = 0, queued = false;
    const pull = () => {
      queued = false;
      mags.forEach(btn => {
        const b = btn.getBoundingClientRect(), R = 32;
        const near = mx > b.left - R && mx < b.right + R && my > b.top - R && my < b.bottom + R;
        const x = near ? Math.max(-1, Math.min(1, (mx - b.left - b.width / 2) / (b.width / 2 + R))) : 0;
        const y = near ? Math.max(-1, Math.min(1, (my - b.top - b.height / 2) / (b.height / 2 + R))) : 0;
        btn.style.setProperty("--gx", (x * 6).toFixed(1) + "px"); btn.style.setProperty("--gy", (y * 4).toFixed(1) + "px");
      });
    };
    addEventListener("pointermove", e => { if (e.pointerType !== "mouse") return; mx = e.clientX; my = e.clientY; if (!queued) { queued = true; requestAnimationFrame(pull); } }, { passive: true });
  }

  // FAQ: animate the answer open and closed (plain toggle under reduced motion)
  document.querySelectorAll(".faq details").forEach(d => {
    const sum = d.querySelector("summary"), ans = d.querySelector(".ans");
    let anim = null;
    sum.addEventListener("click", e => {
      if (root.classList.contains("rm") || !ans.animate) return;
      e.preventDefault();
      if (anim) anim.cancel();
      const opening = !d.open;
      if (opening) d.open = true;
      anim = ans.animate(opening ? [{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }]
                                 : [{ opacity: 1 }, { opacity: 0, transform: "translateY(-4px)" }],
        { duration: opening ? 260 : 160, easing: opening ? "cubic-bezier(.2,.8,.2,1)" : "ease-out" });
      anim.onfinish = () => { anim = null; if (!opening) d.open = false; };
    });
  });

  // mobile: show the pinned Fastwork bar between the hero and the closing band
  const mbar = document.getElementById("mbar"), band = document.getElementById("contact");
  const mq = matchMedia("(max-width:767px)");
  const setBar = () => {
    const on = mq.matches && hero.getBoundingClientRect().bottom < 0 && band.getBoundingClientRect().top > innerHeight;
    mbar.classList.toggle("show", on); root.classList.toggle("has-mbar", on);
  };
  addEventListener("scroll", setBar, { passive: true }); addEventListener("resize", setBar); setBar();

