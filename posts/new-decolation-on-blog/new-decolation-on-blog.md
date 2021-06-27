---
date: 2021-03-23
title: New Decoration of Blog
---

It's a little long since my last update. Many things happened during past few months. Maybe the most important one is I've left Ericsson, which company I served for almost 4 years, and finally decided to look for another change outside. It will be a hard period before found a new place to stay, but life is journey of struggle and suffering. No one will benefit from complain about it.

Thanks to this, I got some free time to summary up my previous work and thought. The first thing is to renew my blog.

## Change to Pandoc

I've used [Hexo](https://hexo.io/), [Pelican](https://blog.getpelican.com/) and [Hugo](https://gohugo.io/) to generate ( build) my static blog. They are all good, but I always found I need to tweak something to meet my requirement. They are not just working out of box. That's why I was always moving between those tools. As I found I waste more time on these " static site generator" than writing content, I'm feeling tired of all these things. I'm not web guy, and I don't think the so-called "modern web" things are all necessary. I decide to make it simpler and more straightforward, that is doing all stuff myself.

The basic idea is that I only need a script instead of a "system". The script will invoke external tools to build the source to output. To be simple, it should not have too much knowledge of the content. Python is ultimate for scripting, so it's **build.py**. Consideration of writing the script are:

- One folder for source, and one folder for output. Separating source from output makes it easy for cleanup and rebuild.
  - Source folder will keep all the markup, images and any other kink of file considering to be "source".
  - Output folder is suite for distribution and host on GitHub pages. It can be safely deleted and regenerated from source.

- For writing content of blog, Markdown (*.md*) is not perfect, but good. It's not feature rich but support necessary elements for writing post and every easy to write. [Pandoc](https://pandoc.org/) can help to convert Markdown to HTML.
  - Markdown is so popular, and it's support is universal. However, it has so many flavours, and the syntax/feature may be different in different tools. This may cause issue between editor

- All other files are treat as "static", they are only need to be copied to destination folder. If someday I decided another file format should be "build" (maybe plot generate script), it is just invoke another tool for that format.

- Folder structure should be keep, so link in Markdown file still will work after build. I don't need any server for local preview. Just open the HTML file using browser, the page will show well with valid links. There are two problems:
  - Folder and file name should not contain space, since white space is not friendly for web browser.
  - Link to another post in markdown will not work in generated HTML, since it will refer to *.md* file. Simply search and replace will work, but it will require writing a Pandoc filter. Currently, I don't want to touch the detail in build script.
