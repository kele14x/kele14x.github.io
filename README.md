# kele14x.github.io

Source (markdown) and generated HTML documents for my blog, as also as a simple builder (**build.py**) for my blog.

The blog should be host at [kele14.me](https://kele14.me).

## Dependency

* [Pandoc](https://pandoc.org/): `pandoc` must be available in path.

* [Python](https://www.python.org/): `python` may not in path be should have a way to call it.

  * Python module [python-frontmatter](https://pypi.org/project/python-frontmatter/). It can be installed via: `python -m pip install python-frontmatter`.

## Build

If `make` is available, it should help with daily works:

```bash
make
```

Or use python to directly run the build script:

```bash
python build.py
```
