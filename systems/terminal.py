EXIT = "exit"
prompt = "/home/ubuntu>"



def main():
    while True:
        command = input(prompt)
        if command is not None and len(command) > 0:
            tokens = command.split()
            if tokens is not None and tokens[0] == EXIT:
                break
            else:
                print(f"{command}: command not found")
main()
