# Block

Blog focused theme for [Zola](https://www.getzola.org/), powered by
[TailwindCSS](https://tailwindcss.com/), in the
[Acid](https://github.com/acid-theme/acid) Citric colors.

Block needs Zola 0.23 or later.

Demo: https://block-zola.netlify.app/

![sreenshot](./screenshot.png)

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

## Variables

You can use the following variables in your `config.toml`.

```toml
[extra.intro]
heading = "Blog/Black theme for Zola"
subheading = "Thoughts, stories and ideas."
avatar_url = "https://picsum.photos/200"

[extra.footer]
license_text = ""
```

Check [theme.toml](./theme.toml) for more info.

## Syntax highlighting

Zola needs a highlighting theme. Add one to your `config.toml`:

```toml
[markdown.highlighting]
theme = "gruvbox-dark-medium"
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

Example: `templates/base_layout.html`

```html
{% extends "block/templates/base_layout.html" %} {% block license_text %}
<div>
  The content for this site is
  <a
    href="https://creativecommons.org/licenses/by-sa/2.0/"
    target="_blank"
    class="font-medium"
    >CC-BY-SA</a
  >. The
  <a
    href="https://github.com/ssiyad/ssiyad.github.io"
    target="_blank"
    class="font-medium"
    >code for this site</a
  >
  is
  <a
    href="https://www.gnu.org/licenses/gpl-3.0.en.html"
    target="_blank"
    class="font-medium"
    >GPLv3</a
  >.
</div>
{% endblock %}
```

## Self Promotion

Like this project? Give it a star! ⭐, and spread the word! 🚀. And if you are
feeling especially charitable, follow [Sabu Siyad](https://ssiyad.com) on
[GitHub](https://github.com/ssiyad). Thanks!
