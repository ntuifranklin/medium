MKDIR = "mkdir"


def mkdir(options:list):
    
    if options is not None:
        import os
        if len(options) == 0:
            print("""
                mkdir: missing operand  
                Try 'mkdir --help' for more information.
                """)

        elif len(options) == 1:
            os.mkdir(options[0])
        else:
            print("mkdir: Unexpected behavior")
