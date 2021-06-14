import os

source_dirs = ['content']

source_files = ['.md', '.rst']


def list_sources(srcdir: str):
    for dirpath, _, filenames in os.walk(srcdir):
        for filename in filenames:
            _, ext = os.path.splitext(filename)
            if ext.lower() in source_files:
                yield os.path.join(dirpath, filename)


def get_target_path(srcpath: str) -> str:
    newpath, _ = os.path.splitext(newpath)
    return newpath + '.html'


def convert_file(srcpath: str, targetpath: str):
    os.system(f'pandoc --standalone -o {targetpath} {srcpath}')



def generate_index():



if __name__ == '__main__':
    curdir = os.path.dirname(__file__)
    os.chdir(curdir)

    for source in list_sources(SOURCE_DIR):
        target = get_target_path(source)
        print(f'{source} -> {target}')
        convert_file(source, target)
