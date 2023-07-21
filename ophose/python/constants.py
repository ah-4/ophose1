import json

BUILD_FOLDER = "build/"
EXPORT_PATHS = {
    "js_bundle": BUILD_FOLDER + "ophose/source/js_bundle.js",
    "default": "ophose/app/export/default/"
}

PROJECT_CONFIG = json.load(open("project.oconf", 'r'))