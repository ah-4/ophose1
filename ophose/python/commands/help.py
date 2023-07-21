from ophose.python.info import VERSION

def cmd_help(args):
    '''
    Displays help.
    '''
    from ophose.python.util.command_util import COMMANDS

    def get_arguments_for(cmd_parameters):
            return f'{" ".join([("<" + arg["name"] + ">" if arg["required"] else "[<" + arg["name"] + ">]") for arg in cmd_parameters["arguments"]]) if "arguments" in cmd_parameters else ""}'
        
    def get_options_for(cmd, cmd_parameters):
        if not "options" in cmd_parameters or len(cmd_parameters["options"]) == 0:
            return ""
        option_line = f'\n    {cmd} options:\n'
        for option, option_parameters in cmd_parameters["options"].items():
            option_line += f'        -{option}{"".join(["|-" + option_alias for option_alias in option_parameters["aliases"]] if option_parameters["aliases"] else "")} {"".join(["(" + option_arg + ") " for option_arg in option_parameters["arguments"]] if "arguments" in option_parameters else "")}- {option_parameters["description"]}\n'
        return option_line


    def get_description_for(cmd_parameters):
        return " | " + cmd_parameters["description"] if "description" in cmd_parameters else ""

    def get_command_line(cmd, cmd_parameters):
        return f'{cmd} ' + get_arguments_for(cmd_parameters) + get_description_for(cmd_parameters) + get_options_for(cmd, cmd_parameters) + '\n'

    def __print_all_commands():
        for cmd, cmd_parameters in COMMANDS.items():
            print('    ' + get_command_line(cmd, cmd_parameters))

    if len(args["args"]) > 0:
        cmd = args["args"][0]
        if cmd in COMMANDS:
            print("Printing help for command '{}'".format(cmd))
            print(get_command_line(cmd, COMMANDS[cmd]))
        else:
            print("Command '{}' has not been found.".format(cmd))
    else:
        print(f'OCL [{VERSION}] by AH4')
        print("Usage: ocl <command> [args] [options]")
        print("Available commands:")
        __print_all_commands()
        print("For more information about a command, type 'ophose help <command>'")
