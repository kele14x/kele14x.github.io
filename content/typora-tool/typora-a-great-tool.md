---
title: "Typora a Great Tool for Markdown"
date: 2020-01-21T10:31:03+08:00
categories: [Tool]
tags: [Typora, Markdown]
---

Even [Markdown sucks](/posts/why-markdown-sucks/), it's lightweight and good for writing blog and personal notes. [Typora](https://typora.io/) is Great tool for writing markdown. It provides standard markdown with some useful extensions, such as math and diagram. Some tips and tricks for Typora here.

<!--more-->

## Install

Typora can be download at it's official site. For Linux, you can choose apt repository or binary package.

## Modify Font

Font is important for writers, especially when build-in themes are not very good for Chinese words. Typora provides a guide on how to modify fonts on *Help \> Custom Themes*. That is create and write a `base.user.css` under theme folder.

```css
body {
    font-family: "Ubuntu Mono", "Noto Sans CJK SC", sans-serif;
}
```

It works on both Source Code Mode and View Mode. Typora is build on top of Chromium, so you can open Chromium DevTools (*View \> Toggle DevTools*) to inspect used fonts.

## Disable Smooth Scrolling

To disable smooth scrolling, which I don't like, I need to add a switch to Chromium launch option. In Typora, open *File > Preference... > General > Advanced Settings > Open Advanced Settings*, modify this line of configuration JSON.

```json
{
    "flags": [["disable-smooth-scrolling"]]
}
```

## Image Handling

You can configure Typora to automatically copy used image files to a folder in *File > Preference... > Image*, and *Format > Image > When Insert Local Image*. This makes Typora handles markdown file and asset images together.
