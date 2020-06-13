@echo off
REM ###############################################################################
REM # CONFIGURE THE BELOW SETTINGS ONLY
REM # DATA_PATH - The path to the data for your foundry is installed (modules/worlds)
SET DATA_PATH=%LOCALAPPDATA%\FoundryVTT
REM # INSTALL_PATH - Path where foundry is actually installed to
SET INSTALL_PATH=C:\Program Files\FoundryVTT\resources\app
REM ###############################################################################
REM # DO NOT MODIFY ANYTHING BELOW THIS LINE
SET VERSION =  0.1.1
REM # Version  0.1.0 - Initial Version
REM #          0.1.1 - Added Admin check
SET PLUTONIUM_PATH=%DATA_PATH%\Data\modules\plutonium\server
SET SERVER_MOD=%PLUTONIUM_PATH%\plutonium-backend.js
REM # Check if the script was ran as an administrator
ECHO Administrative permissions required. Detecting permissions...
 net session >nul 2>&1
 IF %errorLevel% == 0 ( 
   ECHO Success: Administrative permissions confirmed.
 ) ELSE (
     ECHO Failure: Current permissions inadequate.
     ECHO Run this script as an administrator.
     GOTO:NO_ADMIN
 )
REM # check if foundry is installed
IF EXIST "%INSTALL_PATH%" ( CD %INSTALL_PATH% ) ELSE ( GOTO:INSTALL_ERROR )

FIND "plutonium" main.js > NUL && (ECHO "Plutonium edit found") || ( CALL:INSTALL_MOD )

REM # Check if the backed file exists, if not there is an error
IF EXIST "%SERVER_MOD%" ( COPY /Y "%SERVER_MOD%" "%INSTALL_PATH%" ) ELSE ( CALL:NO_PLUTONIUM )

ECHO "MODIFICATIONS COMPLETE"
@PAUSE
GOTO:EOF
:NO_PLUTONIUM
   ECHO "ERROR: Plutonium is not installed, install with the manifest link https://get.5e.tools/plutonium/module.json"
   EXIT 1
:INSTALL_ERROR
   ECHO "ERROR: FoundryVTT is not installed OR you did not configure the settings at the top of this script - download and install from FoundryVTT.com"
   EXIT 1
:INSTALL_MOD
   COPY /Y main.js main.js.bak > NUL
   ECHO "Plutonium edit not found, making edit"
   SET TMP_OUT=main.js.new
   SET strFind="require("init")(process.argv, global.paths, initLogging);"
   REM SET "_strRepl="require("init")(process.argv, global.paths, initLogging).then(() => {      require("plutonium-backend").init();});""
   TYPE main.js | FINDSTR /v %strFind% >> %TMP_OUT%
   ECHO require("init")(process.argv, global.paths, initLogging) >> %TMP_OUT%
   ECHO         .then(() =^> { >> %TMP_OUT%
   ECHO                 require("plutonium-backend").init(); >> %TMP_OUT%
   ECHO         }); >> %TMP_OUT%
   MOVE /Y %TMP_OUT% main.js > NUL
:NO_ADMIN
PAUSE
