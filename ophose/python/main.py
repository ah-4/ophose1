from ophose.python.util.command_util import COMMANDS

def run(args):
    '''
    This is the command line entry point for the ophose tool.
    :param args: The command line arguments.
    '''
    # Define command
    cmd = args[1] if len(args) > 1 else "help"
    if cmd not in COMMANDS:
        for command, command_parameters in COMMANDS.items():
            if "aliases" in command_parameters and cmd in command_parameters["aliases"]:
                cmd = command
                args[1] = command
                break
        else:
            cmd = "help"
    
    # Define raw arguments and options
    raw_args_and_options = {
        "args": [],
        "options": {}
    }

    func = COMMANDS[cmd]["function"]
    if func is None:
        print("Command '{}' is not implemented. Type 'ocl help' for help.".format(cmd))
        return

    if len(args) > 2:
        last_options = None
        last_option = None
        for arg in args[2:]:
            if arg.startswith("-"):
                if last_options:
                    print("Bad syntax. Type 'ocl help {}' for help.".format(cmd))
                    return
                if "options" in COMMANDS[cmd] and arg in COMMANDS[cmd]["options"]:
                    raw_args_and_options["options"].append(arg[1:])
                    raw_args_and_options["options"][arg] = True
                    if "arguments" in COMMANDS[cmd]["options"] and len(COMMANDS[cmd]["options"]["arguments"]) > 0:
                        raw_args_and_options["options"][arg] = {option_arg: None for option_arg in COMMANDS[cmd]["options"]["arguments"]}
                        last_options = list(COMMANDS[cmd]["options"]["arguments"])
                        last_option = arg
                else:
                    print("Unknown option '{}' for command '{}'. Type 'ocl help {}' for help.".format(arg, cmd, cmd))
                    return
            elif last_options:
                option = last_options.pop(0)
                if len(last_options) == 0:
                    last_options = None
                    last_option = None
                raw_args_and_options["options"][last_option][option] = arg
            else:
                raw_args_and_options["args"].append(arg)

    if "arguments" not in COMMANDS[cmd] or len(raw_args_and_options["args"]) >= sum([1 for arg in COMMANDS[cmd]["arguments"] if arg["required"]]):
        COMMANDS[cmd]["function"](raw_args_and_options)
    else:
        print("Missing arguments. Type 'ocl help {}' for help.".format(cmd))
    