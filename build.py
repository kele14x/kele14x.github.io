#!/usr/bin/python
import os
import shutil
import subprocess


def convert_file(source: str, target: str):
    """Convert file to HTML using pandoc."""
    cmd = f'pandoc -d pandoc.yaml -o {target} {source}'
    print(f'Run command: {cmd}')
    try:
        subprocess.run(cmd)
    except subprocess.CalledProcessError as e:
        print(e)


def build(source: str, target: str):
    for dirpath, dirnames, filenames in os.walk(source):
        tardir = dirpath.replace(os.path.basename(source), target, 1)

        # Duplicate folder structure
        for dirname in dirnames:
            p = os.path.join(tardir, dirname)
            print(f'Create folder {p}')
            if not os.path.lexists(p):
                os.mkdir(os.path.join(tardir, dirname))
            elif not os.path.isdir(p):
                raise FileExistsError(f'{p} already exists but is not a '
                                      'directory')

        # Copy or convert file
        for filename in filenames:
            root, ext = os.path.splitext(filename)
            s = os.path.join(dirpath, filename)
            if ext.lower() in ['.md']:
                t = os.path.join(tardir, root) + '.html'
                # Convert file
                print(f'Convert file {s} -> {t}')
                convert_file(s, t)
            else:
                t = os.path.join(tardir, filename)
                print(f'Copy file {s} -> {t}')
                shutil.copyfile(s, t)


if __name__ == '__main__':
    current_dir = os.path.dirname(__file__)
    os.chdir(current_dir)
    print(f'Working on directory: {current_dir}')

    if not os.path.lexists('docs'):
        os.mkdir('docs')
    plist = build('posts', 'docs')
    build('assets', 'docs')

    print('All done')
