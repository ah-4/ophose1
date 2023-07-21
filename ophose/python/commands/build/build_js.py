# Imports
import re
import time
import os
from ophose.python.constants import EXPORT_PATHS

# Constants
DEFAULT_SCRIPTS_FILE_INCLUDER_PATH = "ophose/app/dependencies/scripts.php"

ALIAS_ENV = "env"
ALIAS_ENV_COMP = "env_comp"

OPHOSE_IMPORT_REGEX_TABLES = {
        r"oimpc\(('|\")([^'|\"]*)('|\")\)": "components/",
        r"oimpcO\(('|\")([^'|\"]*)('|\")\)": "ophose/components/",
        r"oimpm\(('|\")([^'|\"]*)('|\")\)": "modules/",
        r"oimpmO\(('|\")([^'|\"]*)('|\")\)": "ophose/modules/",
        r"oimpe\(('|\")([^'|\"]*)('|\")\)": ALIAS_ENV,
        r"oimpec\(('|\")([^'|\"]*)('|\"), *('|\")([^'|\"]*)('|\")\)": ALIAS_ENV_COMP
    }

# Variables
js_files_order = []
imported_js_files = []
js_bundle_file_content = ''

# Functions

def get_js_files_from_dir(dir_path):
    js_files = []
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith(".js"):
                file_path = os.path.join(root, file).replace('\\', '/')
                js_files.append(file_path)
    return js_files

def get_ordered_imported_js_files():

    unordered_js_component_files = get_js_files_from_dir('components')
    unordered_js_component_files += get_js_files_from_dir('pages')

    def get_used_js_files(js_comp_code):
        files = []
        for regex, path_dir in OPHOSE_IMPORT_REGEX_TABLES.items():
            matches = re.findall(regex, js_comp_code)
            for match in matches:
                path = ""
                if path_dir == ALIAS_ENV:
                    path = "env/" + match[1] + '/env_init.js'
                elif path_dir == ALIAS_ENV_COMP:
                    path = "env/" + match[1] + '/components/' + match[4] + '.js'
                else:
                    path = match[1] + '.js'
                    if path.startswith('/'): path = path[1:]
                    path = path_dir + path
                files.append(path)
        return files

    read_files = []
    new_files = []
    files_depending_from = {}

    for js_file in unordered_js_component_files:
        if js_file in read_files: continue
        read_files.append(js_file)
        with open(js_file) as f:
            js_comp_code = f.read()
            files = get_used_js_files(js_comp_code)
            files_depending_from[js_file] = []
            for new_file in files:
                if new_file not in unordered_js_component_files:
                    new_files.append(new_file)
                    unordered_js_component_files.append(new_file)
                if new_file not in files_depending_from[js_file]:
                    files_depending_from[js_file].append(new_file)

    while len(new_files) > 0:
        for js_file in new_files:
            if js_file in read_files: continue
            read_files.append(js_file)
            with open(js_file) as f:
                js_comp_code = f.read()
                files = get_used_js_files(js_comp_code)
                files_depending_from[js_file] = []
                for new_file in files:
                    if new_file not in unordered_js_component_files:
                        new_files.append(new_file)
                        unordered_js_component_files.append(new_file)
                    if new_file not in files_depending_from[js_file]:
                        files_depending_from[js_file].append(new_file)
        for file in read_files:
            if file in new_files:
                new_files.remove(file)

    # sort files depending from in unordered_js_component_files
    def verify_order():
        for file in unordered_js_component_files:
            for dep_file in files_depending_from[file]:
                if unordered_js_component_files.index(dep_file) >= unordered_js_component_files.index(file):
                    return False
        return True

    while not verify_order():
        tmp_order = unordered_js_component_files.copy()
        for file in unordered_js_component_files:
            for dep_file in files_depending_from[file]:
                if unordered_js_component_files.index(dep_file) >= unordered_js_component_files.index(file):
                    tmp_order.remove(dep_file)
                    tmp_order.insert(unordered_js_component_files.index(file), dep_file)
        unordered_js_component_files = tmp_order

    return unordered_js_component_files

def init_js_files_order():
    global js_files_order, imported_js_files

    # Init JS file include order content
    include_file_content = ''
    with open(DEFAULT_SCRIPTS_FILE_INCLUDER_PATH) as f:
        include_file_content = f.read()

    # Get include JS files order
    js_files_order = re.findall(r'(?<=src=")(.*?)(?=")', include_file_content)
    js_files_order = list(map(lambda x: x[1:], js_files_order))

    # Remove build folder from the list
    for file in js_files_order.copy():
        if file.startswith('build/') or file.startswith('.ophose/'):
            js_files_order.remove(file)

    # Remove special js from the list
    js_files_order.remove('components/Base.js')

    # Add build folder to the list
    js_files_order += get_js_files_from_dir('ophose/app/export/js')

    # Add every file from /components and /pages
    imported_js_files += get_ordered_imported_js_files()

    js_files_order += imported_js_files
    
def css_minify(js_code):

    def minify(css):
        # Supprime les commentaires
        css = re.sub(r'/\*[\s\S]*?\*/', '', css)
        # Supprime les espaces, tabulations et retours à la ligne inutiles
        css = re.sub(r'\s*([:;{},])\s*', r'\1', css)
        # Retourne le code CSS minifié
        return css

    css_pattern = r'/\* css \*/`([^`]*)`'
    matches = re.findall(css_pattern, js_code)
    for match in matches:
        css = match
        js_code = js_code.replace(f'/* css */`{css}`', f'`{minify(css)}`')
    return js_code

def html_minify(js_code):

    def minify(html):
        # Remplacer les espaces, les sauts de ligne et les tabulations par des espaces uniques
        html = re.sub(r'\s+', ' ', html)
        
        # Retirer les commentaires HTML
        html = re.sub(r'<!--.*?-->', '', html)
        
        # Retirer les espaces supplémentaires autour des balises
        html = re.sub(r'>\s+<', '><', html)
        
        return html.strip()

    html_pattern = r'/\* ?html ?\*/`([^`]*)`'
    matches = re.findall(html_pattern, js_code)
    for match in matches:
        html = match
        js_code = js_code.replace(f'/* html */`{html}`', f'`{minify(html)}`')
    return js_code

def remove_imports_statements(js_code):
    for regex in OPHOSE_IMPORT_REGEX_TABLES:
        regex = r'(' + regex + r'[;])'
        matches = re.findall(regex, js_code)
        for match in matches:
            js_code = js_code.replace(match[0], '')
    return js_code

def js_minifiy(code):
    return code

def clean_js_bundle_file_content(js_bundle_file_content):

    js_bundle_file_content = css_minify(js_bundle_file_content)
    js_bundle_file_content = html_minify(js_bundle_file_content)
    js_bundle_file_content = remove_imports_statements(js_bundle_file_content)

    js_bundle_file_content = js_minifiy(js_bundle_file_content)

    return js_bundle_file_content

def get_compiled_page_js_content(page_path, js_code):
    fixed_page_path = page_path[len('pages/'):-len('.js')]
    match_ophose_page_class = re.search(r'oshare\((.*?)\)', js_code)
    page_class = match_ophose_page_class.group(1)
    page_share_expr = match_ophose_page_class.group(0)
    js_code = js_code.replace(page_share_expr, f'__OPHOSE_PAGES["{fixed_page_path}"] = {page_class};')
    return js_code

def init_js_bundle_file_content():
    global js_bundle_file_content, js_files_order
    for js_file_path in js_files_order:
        with open(js_file_path) as f:
            js_bundle_file_content += (get_compiled_page_js_content(js_file_path, f.read()) if js_file_path.startswith('pages/') else f.read()) + '\n'
    js_bundle_file_content = clean_js_bundle_file_content(js_bundle_file_content)


def export_js_bundle_file_content():
    # Init JS files order
    print("Initiating JavaScript files order...")
    now = time.time()
    init_js_files_order()
    print("Done in {} seconds.".format(time.time() - now))

    # Creating JS bundle file
    print("Creating JS bundle file...")
    now = time.time()
    init_js_bundle_file_content()
    print("Done in {} seconds.".format(time.time() - now))

    with open(EXPORT_PATHS['js_bundle'], 'w') as f:
        f.write(js_bundle_file_content)