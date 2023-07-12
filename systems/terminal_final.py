from commands_final import *
user = "ubuntu"
host = "ip-172-31-94-74"
end_prompt = "$"
EXIT = "exit"


def main():
    while True:

        current_dir = os.getcwd()
        current_directory = shorten_current_dir(current_dir)
        prompt = f"{user}@{host}:{current_directory}{end_prompt} "
        command = input(prompt)
        if command is not None and len(command) > 0:
            tokens = command.split()
            if tokens is not None and len(tokens) > 0:
                try:
                    if tokens[0] == EXIT:
                        break
                    elif tokens[0] == MKDIR:
                        mkdir(tokens[1:])
                    elif tokens[0] == PWD:
                        pwd()
                    elif tokens[0] == CHDIR:
                        if len(tokens[1:]) == 0:
                            chdir()
                        else:
                            chdir(tokens[1])
                    else:
                        print(f"{command}: command not found")
                except Exception as e:
                    print(f"{e}")

main()
