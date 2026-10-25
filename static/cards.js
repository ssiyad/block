// Block: live GitHub and Bluesky cards on the home page.
// Both APIs are public and allow cross-origin reads. On any failure the
// card keeps what the build rendered.

(() => {
  const github = document.querySelector("[data-github]");
  const bluesky = document.querySelector("[data-bluesky]");
  if (github) fillGithub(github, github.dataset.github).catch(() => {});
  if (bluesky) fillBluesky(bluesky, bluesky.dataset.bluesky).catch(() => {});

  async function fillGithub(card, username) {
    const api = `https://api.github.com/users/${encodeURIComponent(username)}`;
    const user = await getJson(api);
    const repos = await getRepos(api, user.public_repos);
    const stars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

    setText(card, "[data-gh-stars]", stars);
    setText(card, "[data-gh-followers]", user.followers);
    reveal(card.querySelector("[data-gh-stats]"));
    const bio = card.querySelector("[data-gh-bio]");
    if (bio && (user.bio || user.name)) {
      bio.textContent = user.bio || user.name;
      reveal(bio);
    }
    const list = card.querySelector("[data-gh-repos]");
    if (list) listRepos(list, repos);
  }

  async function fillBluesky(card, handle) {
    const url =
      "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed" +
      `?filter=posts_no_replies&limit=20&actor=${encodeURIComponent(handle)}`;
    const { feed } = await getJson(url);
    // Reposts carry a reason; posts with only media have no text to quote
    const post = feed.find((i) => !i.reason && i.post.record.text)?.post;
    const quote = card.querySelector("[data-bsky-quote]");
    if (!post) {
      quote.textContent = "Nothing posted yet.";
      return;
    }

    const rkey = post.uri.split("/").pop();
    quote.href = `https://bsky.app/profile/${encodeURIComponent(handle)}/post/${rkey}`;
    quote.textContent = `“${truncate(post.record.text, 280)}”`;
    const time = card.querySelector("[data-bsky-time]");
    time.dateTime = post.record.createdAt;
    time.textContent = describeDate(new Date(post.record.createdAt));
    setText(
      card,
      "[data-bsky-counts]",
      `${post.replyCount ?? 0} replies · ${post.likeCount ?? 0} likes`,
    );
    reveal(card.querySelector("[data-bsky-foot]"));
  }

  // At most five pages: 500 repositories, and six requests a visit
  async function getRepos(api, count) {
    const pages = Math.min(Math.ceil(count / 100), 5);
    const results = await Promise.all(
      Array.from({ length: pages }, (_, i) =>
        getJson(`${api}/repos?per_page=100&sort=pushed&page=${i + 1}`),
      ),
    );
    return results.flat();
  }

  function listRepos(list, repos) {
    for (const repo of repos.filter((r) => !r.fork).slice(0, 3)) {
      const link = document.createElement("a");
      link.href = repo.html_url;
      const name = document.createElement("span");
      name.textContent = repo.name;
      const language = document.createElement("span");
      language.className = "meta";
      language.textContent = repo.language ?? "";
      link.append(name, language);
      const item = document.createElement("li");
      item.append(link);
      list.append(item);
    }
    if (list.children.length) reveal(list);
  }

  async function getJson(url) {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response.json();
  }

  function describeDate(date) {
    const minutes = (date - Date.now()) / 60000;
    const units = [
      ["minute", 60],
      ["hour", 24],
      ["day", 7],
    ];
    let value = minutes;
    for (const [unit, size] of units) {
      if (Math.abs(value) < size) {
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
          Math.round(value),
          unit,
        );
      }
      value /= size;
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  // Counts code points, so an emoji is never cut in half
  function truncate(text, length) {
    const chars = [...text];
    return chars.length > length ? `${chars.slice(0, length).join("")}…` : text;
  }

  function setText(root, selector, value) {
    root.querySelector(selector).textContent = value;
  }

  function reveal(el) {
    el.hidden = false;
  }
})();
