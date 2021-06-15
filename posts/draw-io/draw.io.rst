Draw.io is Good Alternative to Visio
====================================

:date: 2021-03-28
:category: Tools
:tags: draw.io, diagram, tools
:summary: I've been using `MicroSoft Visio <https://en.wikipedia.org/wiki/Microsoft_Visio>`_ for my working related diagrams for a long time. There is no choice since it's a standard document type in company and my boss buy it for me. But for my personal documents, I'm need an alternative. Here comes *draw.io*.

*draw.io* is is a free diagram drawing application for various diagrams. Their site's name is changed to `diagrams.net <https://www.diagrams.net/>`_, but I prefer to use the old name since it should be more well known. It is based on web (HTML, JavaScript, CSS) and has a online editor, as well as a offline software. The offline editor is based on `Electron <https://www.electronjs.org/>`_, which is little bit slow, but still good.

    The modern web technical helps to deliver app to end user quick, but you should never trust a product if it is online only. They just plan to make money and does not care people with poor internet quality or had to work offline.

After open *draw.io*, you are offered a empty A4 sized (or any other size) paper, and you are free to draw line, arc, text, and a set of predefined shapes (called stencils) on it. Basic line, arc and text does not mean much, but predefined shapes is the soul. *draw.io* has many build-in stencils with good quality.

Compare with Other Tools
------------------------

*Draw.io*'s interface and feature is very like MicroSoft's *Visio*, so we can take it as a comparator.  For *Visio*, you need to buy professional version to get the "pro set" of stencils, including BPMN, UML, etc. Actually I don't know what are them, and only use the basic and electronic related shapes. For my experience, *draw.io* instead has more these kind of shape built in. Consider Vivso's price, *draw.io* is definitely your choice.

Besides this, *Draw.io* has a more stable edit environment than *Visio*. During using *Visio*, I usually has the problem of auto arrange breaking your page, freezing, and annoying auto snap. *Draw.io* works more smooth during editing.

In fact, on site `AlternativeTo <https://alternativeto.net/>`_, draw.io is the most rated tool comparing to Visio, Lucidchart and other similar tools.

Embedded into Picture
---------------------

One of another useful feature from *draw.io* is that it can embedded the diagram into an PNG or SVG file. The picture file is automatically updated based on the diagram. It works like this: you create an diagram, and export to PNG or SVG with the option "embedded an copy", or directly save the diagram with extension *.png* or *.svg*. After export or save, the first page will be draw as the picture. And the empty part in the page will ba cropped, only the valid part will be left. You can use *draw.io* directly edit this magic image, and the picture will be updated automatically.

With this feature, when you are heavy modifying your diagram, you does not need to do the edit-export loop. If you are referring the picture from markdown or latex document, you does not need to do any extra step. Just open and edit, like a boss.

VSCode Integration
------------------

There is a `VSCode extension <https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio>`_ that integrates *draw.io* into it. By this extension, you can directly edit the diagram without leaving the editor. Since most time, VSCode will provides the like if you refer to the file. So if you using the *draw.io* embedded picture, you can quickly open the diagram in VSCode by a single clicking.

Will it be Maintained Long?
---------------------------

Currently *Draw.io* is under actively develop. You can see frequency update and release in Github.

After *Draw.io* is changed to *diagrams.net*, they used to offer some paid plans and tries to go commercial. But now seems they decide to make this tool free, but still remains not clear whether they have sponsoring or it's community driven.

I'm not sure whether they has a healthy way for profit. But I hope it can last longer. So if you like the software, consider become a sponsor.
