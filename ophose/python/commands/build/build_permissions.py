import time
from ophose.python.constants import EXPORT_PATHS, PROJECT_CONFIG
HTACCESS_SAMPLE_FILE_PATH = EXPORT_PATHS["default"] + "permissions/htaccess"

def get_default_htaccess_file_content():
    with open(HTACCESS_SAMPLE_FILE_PATH, 'r') as f:
        return f.read()

def gen_htaccess_file_content(htaccess_content):

    # Force HTTPS redirect
    if PROJECT_CONFIG["build"]["redirect"]["force_https_redirect"]:
        htaccess_content = htaccess_content.replace("{force_https_redirect}", "RewriteCond %{HTTPS} off\nRewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L,QSA]\n")
    else:
        htaccess_content = htaccess_content.replace("{force_https_redirect}", "")

    return htaccess_content

def export_htaccess_file():
    # Creating JS bundle file
    print("Creating .htaccess file...")
    now = time.time()
    htaccess_file_content = gen_htaccess_file_content(get_default_htaccess_file_content())
    with open(".htaccess", 'w') as f:
        f.write(htaccess_file_content)
    print("Done in {} seconds.".format(time.time() - now))