# My Blog

Source code/markdown for my blog.

## Requirement

### Tools

* [Hugo](https://github.com/gohugoio/hugo/releases/) for site generation;

* [Pandoc](https://github.com/jgm/pandoc/releases) for rendering some markdown file.

### Components

* [hugo-notepadium](https://github.com/cntrump/hugo-notepadium/releases) as theme.

## Setup Tools

### Windows

1. [Optional] Install [scoop](https://scoop.sh/), a automatic software install tool for windows;
2. Install Hugo, if scoop, `scoop install hugo`;
3. Install Pandoc, if scoop, `scoop install pandoc`

### Ubuntu

1. `sudo apt install hugo`
2. `sudo apt install pandoc`

### Common

1. `git clone git@github.com:kele14x/myblog.git`
2. `cd myblog & git clone git@github.com:kele14x/kele14x.github.io.git public`

## Working Flow

### Create New Post

`hugo new posts/<name-of-post>.md`

### Edit Post

Use text editor.

### Local Test

`hugo serve -D`

Navigate browser to **http://localhost:1313/** (default address)

### Build

`hugo -gc --cleanDestinationDir`