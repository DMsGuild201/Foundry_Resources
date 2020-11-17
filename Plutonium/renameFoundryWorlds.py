import os
from os import fdopen, remove
import sys
import mimetypes
from tempfile import mkstemp
from shutil import move, copymode
from pathlib import Path

################################################################################
# USER EDITABLE AREA
# Foundry Data Worlds Location:
foundry_data = str(Path.home()) + os.sep + "foundrydata" + os.sep + "Data" + os.sep + "worlds"
################################################################################
# DO NOT EDIT ANYTHING BELOW THIS LINE #
# VERSION: 0.0.1 - Development Build
assert os.path.isdir(foundry_data), "Invalid Foundry Data path set in the config header of this file.  Directory does not exist."

print(os.listdir(foundry_data))

user_input = input("Which world are you renaming (folder name)?\n")
directory = os.path.dirname(foundry_data + os.sep + user_input + os.sep)
assert os.path.isdir(directory), "Invalid directory! Invalid world name: "+str(user_input)

search_string = user_input

replace_string = input("What would you like to rename this world to?\n")

# Add *.db and *.json files to the mimetype map as text files
mimetypes.add_type("text/plain",".db",strict=True)
mimetypes.add_type("text/plain",".json",strict=True)

for root, directories, files in os.walk(directory, topdown=False):
   for name in files:
      fil = os.path.join(root, name)
      #print('File: %s' %fil)
      if mimetypes.guess_type(fil)[0] == 'text/plain':

         open_file = open(fil, 'r')
         if search_string in open_file.read():
            print('Found string in file: %s' %open_file)
            open_file.close()

            fh, abs_path = mkstemp()
            with fdopen(fh, 'w') as new_file:
               with open(fil) as old_file:
                  for line in old_file:
                     new_file.write(line.replace(search_string, replace_string))
            # Copy over permissions from original
            copymode(fil, abs_path)
            # Remove Original (backup)
            move(fil, fil + ".bak")
            move(abs_path, fil)
         else:
            open_file.close()
      # End Text File
   # End of Inner Loop
# End of outer loop

# Rename the world folder
os.rename(foundry_data + os.sep + user_input, foundry_data + os.sep + replace_string)
