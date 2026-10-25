// Block: reading progress and table of contents scroll-spy.
// Each part runs only when its markup is on the page.

(() => {
  trackProgress(document.querySelector("[data-progress]"));
  spyHeadings(document.querySelector("[data-toc]"));

  function trackProgress(bar) {
    if (!bar) return;
    let queued = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--progress", max > 0 ? scrollY / max : 0);
      queued = false;
    };
    addEventListener(
      "scroll",
      () => {
        if (!queued) requestAnimationFrame(update);
        queued = true;
      },
      { passive: true },
    );
    update();
  }

  function spyHeadings(toc) {
    if (!toc) return;
    const links = new Map(
      [...toc.querySelectorAll("a")].map((a) => [
        decodeURIComponent(a.hash.slice(1)),
        a,
      ]),
    );
    const headings = [...links.keys()]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const mark = (id) => {
      for (const [key, a] of links)
        a.toggleAttribute("aria-current", key === id);
    };
    // The current heading is the last one scrolled past the top third of the view
    const update = () => {
      const line = innerHeight / 3;
      const passed = headings.filter(
        (h) => h.getBoundingClientRect().top < line,
      );
      mark((passed.at(-1) ?? headings[0])?.id);
    };
    addEventListener("scroll", update, { passive: true });
    update();
  }
})();
