#!/bin/bash

###############################################################################
# CONFIGURE THE BELOW SETTINGS ONLY
# DATA_PATH - The path to the data for your foundry is installed (modules/worlds)
DATA_PATH="$HOME/foundrydata"
# INSTALL_PATH - Path where foundry is actually installed to
INSTALL_PATH="$HOME/foundryvtt/resources/app"
###############################################################################
# DO NOT MODIFY ANYTHING BELOW THIS LINE
VERSION=0.1.1
# Version 0.1.0 - Initial Version
#         0.1.1 - Corrected path in sed command to use variable INSTALL_PATH
SERVER_MOD=$DATA_PATH/Data/modules/plutonium/server/plutonium-backend.js
# check if foundry is installed
if [[ -f "$INSTALL_PATH/main.js" ]]
then

   if grep -q "plutonium" $INSTALL_PATH/main.js
   then
      echo "Plutonium edit found"
   else
      cp $INSTALL_PATH/main.js $INSTALL_PATH/main.js.bak
      echo "Plutonium edit not found, making edit"
      sed 's/require("init")(process.argv, global.paths, initLogging);/require("init")(process.argv, global.paths, initLogging).then(() => {      require("plutonium-backend").init();});/g' $INSTALL_PATH/main.js -i
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
