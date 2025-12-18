# kele14x.github.io

Source contents of [my blog](https://blog.kele14.com).

## Configuration

### Enable Markdown Link Render Hook

``` toml
[markup]
  [markup.goldmark]
    [markup.goldmark.renderHooks]
      [markup.goldmark.renderHooks.link]
        useEmbedded = 'fallback'
```

This enables [markdown link render hook](https://gohugo.io/render-hooks/links/) so that internal link to *.md* becomes *.html* at output.

### Disable Typographer

The default Hugo's markdown processor [Goldmark](https://github.com/yuin/goldmark/) has enabled the Typographer extension to replaces certain character combinations with HTML entries like dash and quote ([ref](https://gohugo.io/configuration/markup/#typographer
)). It's stupid. To disable it, include those configuration in the `hugo.toml`:

``` toml
[markup]
  [markup.goldmark]
    [markup.goldmark.extensions]
      [markup.goldmark.extensions.typographer]
        disable = true
```

### Enable Passthrough

To render math using [KaTex](https://katex.org/), we need to enable passthrough for the markdown processor to bypass some text to final html:

``` toml
[markup]
  [markup.goldmark]
    [markup.goldmark.extensions]
      [markup.goldmark.extensions.passthrough]
        enable = true
        [markup.goldmark.extensions.passthrough.delimiters]
          block = [['\[', '\]'], ['$$', '$$']]
          inline = [['\(', '\)']]
```

Then include the html in page ([ref](https://katex.org/docs/autorender)):

``` html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css" integrity="sha512-fHwaWebuwA7NSF5Qg/af4UeDx9XqUpYpOGgubo3yWu+b2IQR4UeQwbb42Ti7gVAjNtVoI/I9TEoYeu9omwcC6g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js" integrity="sha512-LQNxIMR5rXv7o+b1l8+N1EZMfhG7iFZ9HhnbJkTp4zjNr5Wvst75AqUeFDxeRUa7l5vEDyUiAip//r+EFLLCyA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js" integrity="sha512-iWiuBS5nt6r60fCz26Nd0Zqe0nbk1ZTIQbl3Kv7kYsX+yKMUFHzjaH2+AnM6vp2Xs+gNmaBAVWJjSmuPw76Efg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        renderMathInElement(document.body, {
          // customised options
          // • auto-render specific keys, e.g.:
          delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false},
              {left: '\\(', right: '\\)', display: false},
              {left: '\\[', right: '\\]', display: true}
          ],
          // • rendering keys, e.g.:
          throwOnError : false
        });
    });
</script>
```

The original CDN is replaced by [CDNJS](https://cdnjs.com/libraries/KaTeX).
