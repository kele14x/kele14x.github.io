---
title: "Hugo Setup"
date: 2020-01-09T14:39:25+08:00
categories: [Tool]
tags: [Hugo, Markdown]
---

这个世界上有[非常非常多的静态博客生成器](https://www.staticgen.com/)。花样之多，令人眼花缭乱。有些时候不禁让人感慨，人类的生产力竟能浪费至此。我曾经用过 Jekyll、Hexo、Pelican，但是他们都远远不如 [Hugo](https://gohugo.io/) 来的简单，因为安装 Hugo 仅需要下载一个 10+MB 的可执行文件。

<!--more-->

在这个人人致力于把事情搞复杂的年代，简单就成为了难能可贵的优点。作为对比，在 Windows 下安装 Github 御用的 Jekyll，你需要安装 Ruby、数十个 RubyGems、以及 MSYS2——总容量超过 1 GB 的 🚮。我在很早以前就切换成了 Hugo。但尽管简单，它仍然不是傻瓜无脑的简单。

## 安装和使用 Hugo

在 [Hugo Releases](https://github.com/gohugoio/hugo/releases) 页面下载对应 OS 的版本，Windows 可以配置下 Path，然后在终端执行 `hugo version`。

## 新建站点

参考 [Hugo's Quick Start](https://gohugo.io/getting-started/quick-start/) 运行：

`hugo new site <name-of-blog>`

## 添加主题

Hugo 并没有自带主题，因此需要从 [Hugo theme]([themes.gohugo.io](https://themes.gohugo.io/) ) 挑选一个主题。安装主题仅需复制主题文件夹到 *theme* 文件夹。但一般我们用 Git 克隆项目，以便后续更新。同样，站点主目录也用 Git 管理版本，因此主题被设置为 Git 子模块。

```bash
cd name-of-blog
git init
git submodule add https://github.com/cntrump/hugo-notepadium.git themes/hugo-notepadium
```

在 *config.toml* 文件中配置 `theme = "hugo-notepadium"` 以启用主题。

## 工作流程

### 新建文章

```bash
hugo new posts/my-first-post.md
```

或者直接在 *\<name-of-blog\>/content/posts* 下面放 *.md* 文件

### 编辑 Markdown 封面

我们放一些信息（封面）在每个 *.md* 文件的头部，用于提供一些必要信息，参考 [Front Matter](https://gohugo.io/content-management/front-matter/)。

### 本地预览

```bash
hugo server -D
```

`-D` 表示包含 draft 文章

### 本地生成

```bash
hugo --gc --cleanDestinationDir
```

`--gc` 用于清理生成时产生的垃圾，`--cleanDestinationDir` 表示用于清理目标文件夹，用于保证目标文件夹里的文件都是必要的。

### Push 至 web 服务器

想办法把 *public* 文件夹内的文件上传到 web 服务器

## Tips and Tricks

### 中文支持

* 在配置中设置 `hasCJKLanguage = True` 用于开启 CJK 字数统计支持
* 在配置中设置 `defaultContentLanguage = "zh-cn"` 用于配置 html 标签的 lang 属性，浏览器会根据此标签选择字体（也许是搞砸）

### 文章预览

一些主题会在文章列表内显示预览（Summary），可以在文章中添加 `<!--more-->` 标签自动分割出一部分文章作为预览。

### 关闭自动 Unicode 标点替换

* Hugo 默认的 Markdown 翻译器是 Goldmark。在配置中设置

  ```
  [markup.goldmark.extensions]
  typographer = false
  ```

  来关闭恼人的自动 Unicode 符号替换（例如 `'` -> `’`）

## 参考

* [Hugo 官网](https://gohugo.io/)
* [Hugo 的 Github 页](https://github.com/gohugoio/hugo)
* [hugo-notepadium 主题](https://themes.gohugo.io/hugo-notepadium/)
* [hugo-notepadium 主题的 Github 页](https://github.com/cntrump/hugo-notepadium)
