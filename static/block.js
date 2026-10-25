// Block: reading progress, table of contents scroll-spy, and live search.
// Each part runs only when its markup is on the page.

(() => {
  trackProgress(document.querySelector("[data-progress]"));
  spyHeadings(document.querySelector("[data-toc]"));
  filterSearch(document.querySelector("[data-search]"));

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

  function filterSearch(form) {
    if (!form) return;
    const input = form.querySelector("input");
    const count = form.querySelector("[data-search-count]");
    const empty = document.querySelector("[data-search-empty]");
    const rows = [...document.querySelectorAll("[data-text]")];
    const total = rows.length;

    const run = () => {
      const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      let shown = 0;
      for (const row of rows) {
        const hit = words.every((w) => row.dataset.text.includes(w));
        row.hidden = !hit;
        if (hit) shown++;
      }
      count.textContent = words.length
        ? `${shown} of ${total} posts`
        : `${total} posts`;
      empty.hidden = shown > 0;
      const query = words.length
        ? `?${new URLSearchParams({ q: input.value })}`
        : "";
      history.replaceState(null, "", location.pathname + query);
    };

    form.addEventListener("submit", (e) => e.preventDefault());
    input.addEventListener("input", run);
    input.value = new URLSearchParams(location.search).get("q") ?? "";
    run();
  }
})();
