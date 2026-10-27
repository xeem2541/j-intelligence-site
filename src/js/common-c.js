  // reveal on enter
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".rv").forEach(el => io.observe(el));

  // process: each step's rule darkens once it has been reached
  const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("lit"); }), { rootMargin: "0px 0px -35% 0px" });
  document.querySelectorAll("#steps li").forEach(s => sio.observe(s));
