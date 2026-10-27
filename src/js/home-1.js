  // hero: the customer starts typing again every few seconds; only while the hero is on screen
  const typing = document.getElementById("typing");
  let typingStarted = false, demo = false;
  const startTyping = delay => {
    if (typingStarted || root.classList.contains("rm")) return;
    typingStarted = true;
    const cycle = on => { if (demo) { typing.classList.remove("on"); return; } typing.classList.toggle("on", on); setTimeout(() => cycle(!on), on ? 2200 : 3200); };
    setTimeout(() => cycle(true), delay);
  };
  if (!root.classList.contains("rm")) {
    let visible = true;
    new IntersectionObserver(es => { visible = es[0].isIntersecting; typing.classList.toggle("paused", !visible || document.hidden); }).observe(hero);
    document.addEventListener("visibilitychange", () => typing.classList.toggle("paused", document.hidden || !visible));
  }

