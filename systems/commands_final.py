import os
MKDIR = "mkdir"
CURRENT_DIR = os.getcwd()
HOME = os.getenv("HOME")

PWD="pwd"
CHDIR="cd"

def shorten_current_dir(folder: str):
    
    if HOME == folder :
        folder = "~"
    return folder

def mkdir(options:list):
    
    if options is not None:
        if len(options) == 0:
            print("""
                mkdir: missing operand  
                Try 'mkdir --help' for more information.
                """)

        elif len(options) == 1:
            os.mkdir(options[0])
        else:
            print("mkdir: Unexpected behavior")

def pwd():
    CURRENT_DIR  = os.getcwd()
    print(CURRENT_DIR)

def chdir(path:str=None):
    if path is None or len(path) == 0:
        pwd()
    else:
        try:
            os.chdir(path)
            CURRENT_DIR=path
        except:
            print("cd: Error")
