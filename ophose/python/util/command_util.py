import ophose.python.info as info

from ophose.python.commands.version import cmd_version
from ophose.python.commands.help import cmd_help
from ophose.python.commands.build import cmd_build

COMMANDS = {
    "build": {
        "description": "Build the project.",
        "function": cmd_build
    },
    "help": {
        "description": "Show all commands and their description.",
        "function": cmd_help,
        "aliases": ["h"],
        "arguments": [
            {
                "name": "command",
                "description": "The command to show help for.",
                "required": False
            }
        ]
    },
    "version": {
        "description": "Show the version of OPHOSE.",
        "function": cmd_version,
        "aliases": ["v"]
    },
    "install": {
        "description": "Install project.",
        "function": None,
        "aliases": ["i"],
        "arguments": [
            {
                "name": "environment_name",
                "description": "The name of the environment to install (i.e.: @ophose/database).",
                "required": False
            }
        ],
        "options": {
            "u": {
                "description": "Updates every environment to the latest version.",
                "aliases": ["-update"],
            }
        }
    }
}

# todo get_arg, get_option, get_args, get_options