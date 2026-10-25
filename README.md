# Block

Blog focused theme for [Zola](https://www.getzola.org/), powered by
[TailwindCSS](https://tailwindcss.com/). Each group of content sits on a paper
island over a slow grain, in the [Acid](https://github.com/acid-theme/acid)
Citric (dark) and Lactic (light) colors. The flavor follows the system.

Motion (grain, rise-in, hand-drawn marks) stops when the system asks for
reduced motion.

Block needs Zola 0.23 or later.

Demo: https://block-zola.netlify.app/

![screenshot](./screenshot.png)

## Setup

In your zola site directory

- Get theme

  ```bash
  git submodule add https://github.com/ssiyad/block themes/block
  ```

- Build CSS

  ```bash
  cd themes/block
  npm ci
  npm run css:build
  ```

- Build your site

  ```bash
  cd ../..
  zola build
  ```

## Configuration

Set these in your `config.toml`. Every key is optional. See
[theme.toml](./theme.toml) for the defaults.

```toml
generate_feeds = true # shows the RSS button on the posts page

[extra]
flavor = "auto"                    # auto, citric (dark) or lactic (light)
posts_section = "posts/_index.md"  # listed on home, search and 404
home_posts = 7
menu = [
  { name = "Home", url = "/" },
  { name = "Posts", url = "/posts/" },
  { name = "Projects", url = "/projects/" },
  { name = "Search", url = "/search/" },
]

[extra.intro]
kicker = "Sabu Siyad's blog"
greeting = "Hello, I am"
name = "Sabu Siyad"
role = "Security Engineer at [Frappe](https://frappe.io)" # inline markdown
avatar_url = "https://example.com/me.jpg" # empty hides the photo plate
plate_label = "Plate I"
links = [{ name = "GitHub", url = "https://github.com/ssiyad" }]

[extra.github]   # empty username hides the card
username = "ssiyad"
repos = [{ name = "block", note = "Zola theme" }]

[extra.bluesky]  # empty handle hides the card
handle = "ssiyad.com"

[extra.footer]
license_text = "The content for this site is CC-BY-SA." # inline markdown
source_url = "https://github.com/ssiyad/block"
```

The text of `content/_index.md` is the bio on the home page.

### Build-time data

The GitHub and Bluesky cards and the Projects page fetch public APIs when
Zola builds the site. A failed request hides the data, not the build.

| Variable                    | Effect                                                        |
| --------------------------- | ------------------------------------------------------------- |
| `GITHUB_TOKEN`              | Lifts the GitHub API limit of 60 requests an hour.            |
| `GITHUB_SHA` / `COMMIT_REF` | Shows the short commit in the footer, linked to `source_url`. |

GitHub Actions sets `GITHUB_SHA` and Netlify sets `COMMIT_REF`.

## Pages

- **Posts**: the section in `posts_section`. Set `sort_by = "date"` and
  `paginate_by` in its `_index.md`. Posts are grouped by year.
- **Post**: a page with its table of contents in the margin. Add
  `extra.mark = "word"` to its front matter to circle that word of the title.
- **Projects**: a page with `template = "projects.html"`.

  ```toml
  +++
  title = "Projects"
  template = "projects.html"

  [extra]
  all_url = "https://github.com/ssiyad?tab=repositories"
  pinned = ["ssiyad/block"] # stats come from the GitHub API
  curated = [
    { name = "Block", description = "Zola theme", role = "Author", years = "2025 →", url = "https://github.com/ssiyad/block" },
  ]
  +++
  ```

- **Search**: a page with `template = "search.html"`. It filters the posts
  in the browser and needs no search index.
- **404**: built in.

## Syntax highlighting

Zola needs a highlighting theme. Add one to your `config.toml`:

```toml
[markdown.highlighting]
light_theme = "gruvbox-light-medium"
dark_theme = "gruvbox-dark-medium"
```

Block sets the code block background, so only the text colors come from this
theme. See the
[built-in themes](https://github.com/getzola/giallo#built-in).

## Components

Block gives these [Tera components](https://keats.github.io/tera/#components)
for your content.

### youtube

Embeds a YouTube video.

```jinja
{{ <youtube video_id="dQw4w9WgXcQ" /> }}
{{ <youtube video_id="dQw4w9WgXcQ" start_at={42} /> }}
```

| Parameter  | Type    | Default | Description                |
| ---------- | ------- | ------- | -------------------------- |
| `video_id` | string  |         | The ID from the video URL  |
| `start_at` | integer | `0`     | The start time, in seconds |

This was a shortcode before Zola 0.23. Change
`{{ youtube(video_id="…", start_at=42) }}` to the syntax above.

## Blocks

You can override individual blocks by following
[this](https://www.getzola.org/documentation/themes/extending-a-theme/#overriding-a-block).
`base.html` has the blocks `title`, `description`, `main_class` and `main`.
To change a part of the page, copy its file from `templates/partials/` into
your site's `templates/partials/`.

## Self Promotion

Like this project? Give it a star! ⭐, and spread the word! 🚀. And if you are
feeling especially charitable, follow [Sabu Siyad](https://ssiyad.com) on
[GitHub](https://github.com/ssiyad). Thanks!
