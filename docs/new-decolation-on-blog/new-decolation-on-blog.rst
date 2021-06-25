New Decoration of Blog
======================

:date: 2021-03-23 02:07
:tags: blog, tools
:category: Blog
:summary: This a lone time since last decoration of this blog. Time to make a change.

It's a little bit long since my last update. Many things happened during past few months. Maybe the most important one is I've left `Ericsson <https://www.ericsson.com/>`_, which company I served for almost 4 years, and finally decided to look for another change outside. It will be a hard period before found a new place to stay, but life is journey of struggle and suffering. No one will benefit from complain about it.

Thanks to this, I got some free time to summary up my previous work and thought. The first thing is to renew my blog.

Change Back to Pelican
----------------------

I've been used `Hugo <https://gohugo.io/>`_ for a long time as my blog site generator. It's super fast as it said due to go is compiled to native code. But I'm very sad that after these long time, it still does not provide a easy way to integrate math equation into markdown. Of course you can write :code:`$...$` or :code:`$$..$$` to embedded equation into markdown, but the problem is *Hugo*'s default markdown engine, `Goldmark <https://github.com/yuin/goldmark/>`_ will process it. Most time it's OK, but if you have double underscore :code:`_` in your equation, it will be convert to annoying :code:`<em>...</em>` in HTML output, which will finally break your equation.

The solution to this problem is easy, use :code:`\_` to escape the underscore in equation. But it will be a curse if you have many of them. A plug-in also can help, but it requires you patch *Hugo* by yourself in you want a plug-in. Another solution is change to another markdown engine, for example, the more functional and friendly engine `pandoc <https://pandoc.org/>`_. But *Hugo* does not offer a way to set default markdown engine for site. You need to set :code:`markup pandoc` in very document's front matter.

Hears unbelievable right? *Hugo* maybe, is the `most popular static site generator <https://jamstack.org/generators/>`_ in the world, still lack of this feature out-of-box.

`Pelican <https://github.com/getpelican/pelican>`_ is my old friend. I've been with it for a long time before I tries *Hugo*. It's time to bring him back:

.. code:: bash

    sudo apt install python3 python3-pip # if you does not have python
    pip3 install pelican --user

``--user`` switch will ensure you does not need root privilege to install *Pelican* tool. (Also it will prevent you from breaking your system's python environment if any issue happened. You can easily remove all user install python package without worry). ``typogrify`` and *Markdown* are two optional packages mentioned in `Pelican's official tutorial <https://docs.getpelican.com/en/latest/quickstart.html>`_:

.. code:: bash

    pip3 install typogrify markdown --user

The ``typogrify`` is required if you want so called *SmartyPants* function in markup. It will convert dashes or quotes from plain text into Unicode style. I don't like the this idea so I just does not install it. Charters I can't directly type using keyboard will make me nervous. If you really want it, you should use a Unicode input method.

*Markdown*, as it's name, is used to render markdown (*.md*) files.

Math Equation in Pelican
------------------------

I choose to escape from *Hugo*, because of unfriendly math equation support. But does *Pelican* do well on this thing? The answer is yes. *Pelican* provide a plug-in to solve the same issue in *Hugo* (markdown engine processing and break equation). The plug-in `render math plugin <https://github.com/pelican-plugins/render-math>`_ can be easy installed by:

.. code:: bash

    pip3 install pelican-render-math --user

And then, that's all. The plug-in will automatically take effect if you does not set ``PLUGINS`` variable in your **pelicanconf.py**. If you set this variable, add ``'render_math'`` to the list. It will ensure ``typogrify`` and markdown/reStructuredText process engine not touch equation field. And it will automatically insert `MathJax <https://www.mathjax.org/>`_ JavaScript to the post that contains math equation. So you does not need to modify your theme's template to manually add *MathJax* (but, yes, you can't use `Katex <https://katex.org/>`_ this case). After this you can easy insert math in markdown or reStructuredText.

.. code:: reStructuredText

    .. math::

        y[n] = \sum_{i,j,k}{|x[n-i]|^k x[n-j]}

It will be rendered like this:

.. math::

    y[n] = \sum_{i,j,k}{|x[n-i]|^k x[n-j]}

*MathJax* is slower than *Katex*, but will support more syntax. So I can accept it. If you does not like *MathJax* much, this plug-in should have some parameter to disable the *MathJax* injection and you can add *Katex* manually.

More about Math on Web
----------------------

In fact, almost all (if not all) static site generators are using client side JavaScript to render math equation to display to readers. It's a little strange towards the word **static**. I think the idea of **static** is pre-rendering all the content and showing to readers. The equation is static, and should be rendered to something like *SVG* by the site generator. However, producing SVG from equation is no fun. Usually it will depend on a Latex distribution to produce the output. Latex, itself, is a little bit complex.

That's why your browser now have to fetch a large JavaScript from CDN and struggle to render math every time you open the page. If your CPU is not fast enough, you will see the page jumps and takes few seconds before set­tle down. It's absolutely not necessary, but that's *modern web*. There is `some idea <https://mcss.mosra.cz/admire/math/>`_ that try to render equation on server, I will try to see if it could work.

Move from Markdown to reStructuredText
--------------------------------------

I used to write a article talks about why *Markdown* sucks. But did not take the determine to change from *Markdown* to *reStructuredText* at that time. Now, I decided to change since I'm really tired about the different flavor of *Markdown*. `reStructuredText <https://docutils.sourceforge.io/rst.html>`_ provides more stable standard and implantation.

A New Theme
-----------

After taking the pain to do the choose, I switch to a new theme called `m.css <https://github.com/mosra/m.css>`_. It looks great (just like what you see), and the most important, it does not force you to use the meaning less JavaScript in theme. The author does hate the *modern web* like me, and try to use pure css to do the theming. It's `well documented <https://mcss.mosra.cz/>`_ and have a lot of features. I just keep a essential set of them. Hope I will have change to use them in further.

That's all for the blog update, I'll slowly bring some valued old content back, and start writing something new, before I goes back to busy struggle about life again.
