user = "ubuntu"
host = "ip-172-31-94-74"
current_dir = "~"
end_prompt = "$"
EXIT = "exit"


def main():
    while True:
        prompt = f"{user}@{host}:{current_dir}{end_prompt} "
        command = input(prompt)
        if command is not None and len(command) > 0:
            tokens = command.split()
            if tokens is not None and tokens[0] == EXIT:
                break
            else:
                print(f"{command}: command not found")
main()
