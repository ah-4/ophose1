from ophose.python.constants import BUILD_FOLDER, EXPORT_PATHS, PROJECT_CONFIG

from ophose.python.commands.build.build_js import export_js_bundle_file_content
from ophose.python.commands.build.build_permissions import export_htaccess_file

import time
import os
import shutil

# Functions

def delete_build_folder():
    if os.path.isdir(BUILD_FOLDER):
        shutil.rmtree(BUILD_FOLDER)
        return True
    return False

def export_build():
    for path in EXPORT_PATHS.values():
        os.makedirs(os.path.dirname(path), exist_ok=True)
    export_js_bundle_file_content()
    export_htaccess_file()

def cmd_build(args):
    print(f'[Ophose] Building project {PROJECT_CONFIG["name"]}...')
    if delete_build_folder():
        print("Old build folder has been deleted.")

    # Exporting build
    print("Starting exporting build...")
    now = time.time()
    export_build()
    print("[Ophose] Build finished in {} seconds.".format(time.time() - now))