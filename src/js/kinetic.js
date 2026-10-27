  // kinetic type: wrap each Thai/English word (Intl.Segmenter keeps vowels and tone marks with their word)
  const seg = window.Intl && Intl.Segmenter ? new Intl.Segmenter("th", { granularity: "word" }) : null;
  document.querySelectorAll(".kt").forEach(el => {
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    let k = 0;
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        const parts = seg ? [...seg.segment(n.textContent)].map(x => x.segment) : n.textContent.split(/(\s+)/);
        parts.forEach(t => {
          if (!t.trim()) { frag.append(t); return; }
          const w = document.createElement("span");
          w.className = "w"; w.style.setProperty("--w", k++); w.setAttribute("aria-hidden", "true"); w.textContent = t;
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
    });
    walk(el);
  });
  const kio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("go"); kio.unobserve(e.target); } }), { threshold: .3 });
  document.querySelectorAll(".kt").forEach(el => kio.observe(el));

