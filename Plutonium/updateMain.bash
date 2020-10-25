#!/bin/bash

###############################################################################
# CONFIGURE THE BELOW SETTINGS ONLY
# DATA_PATH - The path to the data for your foundry is installed (modules/worlds)a
DATA_PATH="$HOME/foundrydata"
# INSTALL_PATH - Path where foundry is actually installed to
INSTALL_PATH="$HOME/foundry/resources/app"
###############################################################################
# DO NOT MODIFY ANYTHING BELOW THIS LINE
VERSION=0.1.3
# Version 0.1.0 - Initial Version
#         0.1.1 - Corrected path in sed command to use variable INSTALL_PATH
#         0.1.2 - Added compatibility with Foundry 0.7.2+
#         0.1.3 - Added compatibility with Foundry 0.7.5

# FUNCTION(S)
# readJson - Reads a single json value (expects only one key in the file)
# args 2: file path, key
function readJson {  
  UNAMESTR=`uname`
  if [[ "$UNAMESTR" == 'Linux' ]]; then
    SED_EXTENDED='-r' # Linux
  elif [[ "$UNAMESTR" == 'Darwin' ]]; then
    SED_EXTENDED='-E' # OSX
  fi; 

  VALUE=`grep -m 1 "\"${2}\"" ${1} | sed ${SED_EXTENDED} 's/^ *//;s/.*: *"//;s/",?//'`

  if [ ! "$VALUE" ]; then
    echo "Error: Cannot find \"${2}\" in ${1}" >&2;
    exit 1;
  else
    echo $VALUE ;
  fi; 
}

# BEGIN MAIN PROCESSING
if [[ -f "$INSTALL_PATH/main.js" ]]
then

   foundryVersion=`readJson $INSTALL_PATH/package.json version`
   foundryMiniorVersion=`echo ${foundryVersion:2:1}`
   # Set the SERVER_MOD path based on the version of Foundry
   if [[ "$foundryMiniorVersion" == "7" ]]
   then
      # Foundry is version 0.7.x
      SERVER_MOD=$DATA_PATH/Data/modules/plutonium/server/0.7.x/plutonium-backend.js
   else
      # Foundry is version 0.6.x
      SERVER_MOD=$DATA_PATH/Data/modules/plutonium/server/0.6.x/plutonium-backend.js
   fi
   
   # Determine if the backend is already modded, if not, make the mod
   if grep -q "plutonium" $INSTALL_PATH/main.js
   then
      echo "Plutonium edit found"
   else
      cp $INSTALL_PATH/main.js $INSTALL_PATH/main.js.bak
      echo "Plutonium edit not found, making edit"
      
      if [[ "$foundryMiniorVersion" == "7" ]]
      then
         # Foundry is version 0.7.x
         sed 's/require("init")(process.argv, global.paths, startupMessages);/require("init")(process.argv, global.paths, startupMessages).then(() => { require("plutonium-backend").init(); });/g' $INSTALL_PATH/main.js -i
      else
         # Foundry is version 0.6.x
         sed 's/require("init")(process.argv, global.paths, initLogging);/require("init")(process.argv, global.paths, initLogging).then(() => { require("plutonium-backend").init(); });/g' $INSTALL_PATH/main.js -i
      fi
   fi

   # Check if the backed file exists, if not there is an error
   if [[ -f "$SERVER_MOD" ]]
   then
      # Returns 2 on a mis-match or FNF, 0 on same file
      if cmp -s "$SERVER_MOD" "$INSTALL_PATH/plutonium-backend.js"
      then
         echo "No plutonium-backend.js modifications were made and is already installed"
      else
         cp "$SERVER_MOD" "$INSTALL_PATH/."
         echo "Installed the plutonium-backend.js file"
      fi
   else
      if [[ -d "$DATA_PATH" ]]
      then
         echo "ERROR: Plutonium is not installed, install with the manifest link https://get.5e.tools/plutonium/module.json"
      else
         echo "ERROR: You did not configure the DATA_PATH at the top of this script or the directory does not exist"
      fi
   fi
else
   echo "ERROR: FoundryVTT is not installed OR you did not configure the settings at the top of this script - download and install from FoundryVTT.com"
fi

echo "Modifications complete!"
