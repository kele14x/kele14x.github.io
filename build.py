#!/usr/bin/python
import os
import subprocess
import shutil
import frontmatter
from typing import List, Tuple


def convert_file(source: str, target: str):
    """Convert file to HTML using pandoc."""
    cmd = f'pandoc --standalone -o {target} {source}'
    print(f'Run command: {cmd}')
    try:
        subprocess.run(cmd)
    except subprocess.CalledProcessError as e:
        print(e)


def generate_index(index: List[Tuple], target: str):
    """Generate index.md, which should contains list of all posts."""
    print(f'Generate file {target}')
    with open(target, 'w', encoding='utf-8', newline='\n') as f:
        f.write(
            '---\n'
            'title: Kele\'s Blog\n'
            '---\n\n'
        )
        for title, path in index:
            f.write(f'- [{title}](./{path})\n\n')


def build(source: str, target: str) -> List[Tuple]:
    posts = []

    for dirpath, dirnames, filenames in os.walk(source):
        tardir = dirpath.replace(os.path.basename(source), target, 1)

        # Duplicate folder structure
        for dirname in dirnames:
            p = os.path.join(tardir, dirname)
            print(f'Create folder {p}')
            if not os.path.lexists(p):
                os.mkdir(os.path.join(tardir, dirname))
            elif not os.path.isdir(p):
                raise FileExistsError(f'{p} already exists but is not directory')

        # Copy or convert file
        for filename in filenames:
            root, ext = os.path.splitext(filename)
            s = os.path.join(dirpath, filename)
            if ext.lower() in ['.md']:
                t = os.path.join(tardir, root) + '.html'
                # Load frontmatter
                fm = frontmatter.load(s)
                title = fm['title']
                url = os.path.relpath(t, target).replace('\\', '/')
                posts.append((title, url))
                # Convert file
                print(f'Convert file {s} -> {t}')
                convert_file(s, t)
            else:
                t = os.path.join(tardir, filename)
                print(f'Copy file {s} -> {t}')
                shutil.copyfile(s, t)

    return posts


if __name__ == '__main__':
    current_dir = os.path.dirname(__file__)
    os.chdir(current_dir)
    print(f'Working on directory: {current_dir}')

    plist = build('posts', 'docs')
    build('assets', 'docs')

    # Generate index.md and convert it to index.html
    index_source = os.path.join('docs', 'index.md')
    index_target = os.path.join('docs', 'index.html')
    generate_index(plist, index_source)
    print(f'Convert file {index_source} -> {index_target}')
    convert_file(index_source, index_target)

    print('All done')
