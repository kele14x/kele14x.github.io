# TODO

For the agents: This is TODOs for this project, if any item is done implementation please mark the item as done.

- [x] Change the homepage to show the full post archive instead of only recent posts. Paginate the archive with 10 posts per page. Keep `/` as page 1 and use `/page/2/`, `/page/3/`, etc. for later pages. Keep the hero section on `/` only.
- [x] Add a top-level `/tags/` page that lists all tags and links to each tag archive page.
- [x] Add a `Tags` item to the top nav bar.
- [x] Remove the unused `categories` concept from the blog content schema and content files so posts are managed only by tags.
- [x] The `head.webp` appears on the hero section and looks good. Please add it to the about page.
- [x] This is site is build by Astro and host on Github pages. Please update the `about.md` to match the fact.
- [x] Change the fenced code language label in posts from `systemverilog` to `system-verilog` so Shiki highlights SystemVerilog code blocks correctly during the Astro build.
- [x] Add a footer on the bottom of all pages (including homepage and individual posts, etc). The footer should contain links labeled `@kele_plus`, `GitHub`, and `CC BY-NC`, with `CC BY-NC` linking to the Creative Commons license page.
- [ ] Add bilingual blog content support for Chinese and English
  - [x] Organize posts into `src/content/blog/zh/` and `src/content/blog/en/`
  - [ ] Keep the Chinese version as the primary source and store the English translation as a separate post in the `en` directory
  - [x] Use the same `slug` for the Chinese and English versions of the same post, and use that shared `slug` to pair translations
  - [x] Add `locale` metadata to blog content entries and update the content schema accordingly
  - [x] Serve Chinese pages under `/zh/`, such as `/zh/<slug>/`, `/zh/posts/`, and `/zh/tags/<tag>/`
  - [x] Serve English pages under `/en/`, such as `/en/<slug>/`, `/en/posts/`, and `/en/tags/<tag>/`
  - [x] Redirect `/` to `/zh/`
  - [x] Update homepage, archive, post, and tag pages to filter content by locale
  - [x] Add a language switcher so readers can move between the Chinese and English versions of the same post
  - [x] Keep tag keys shared across both languages so tag archives stay grouped consistently
  - [x] Allow posts to exist in only one language during migration, and hide the language switcher when the translation does not exist
  - [x] Move About content into `src/content/pages/zh/` and `src/content/pages/en/` so localized About pages can be rendered at `/zh/about/` and `/en/about/`
