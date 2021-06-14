import os
import subprocess

source_dirs = ['posts']
source_files = ['.md', '.rst']


def list_sources(src_dirs: str):
    for dir in src_dirs:
        for dirpath, _, filenames in os.walk(dir):
            for filename in filenames:
                _, ext = os.path.splitext(filename)
                if ext.lower() in source_files:
                    yield os.path.join(dirpath, filename)


def target_path(src_path: str) -> str:
    """Get target file path from source file path."""
    newpath, _ = os.path.splitext(src_path)
    return newpath + '.html'


def convert_file(target_path: str, *src_path: str):
    """Convert file to HTML using pandoc."""
    s = ' '.join(src_path)
    cmd = f'pandoc --standalone -o {target_path} {s}'
    print(f'Run command: {cmd}')
    try:
        subprocess.run(cmd)
    except subprocess.CalledProcessError as e:
        print(e)


def generate_index(files: tuple[str, str]):
    """Generate index.md, which should contains list of all posts."""
    with open('index.md', 'w') as f:
        f.write(
            '---\n'
            'title: Kele\'s Blog\n'
            '...\n\n'
        )
        for src, trg in files:
            filename = os.path.basename(src)
            filename, _ = os.path.splitext(filename)
            filename = filename.replace('-', ' ').title()
            f.write(f'- [{filename.title()}](./{trg})\n\n')


if __name__ == '__main__':
    curdir = os.path.dirname(__file__)
    os.chdir(curdir)
    print(f'Working on directory: {curdir}')

    files = [(src, target_path(src)) for src in list_sources(source_dirs)]
    print(f'{len(files)} files found')

    generate_index(files)
    convert_file('index.html', 'index.md')

    for src, trg in files:
        convert_file(trg, src)
