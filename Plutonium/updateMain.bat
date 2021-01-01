@echo off
REM ###############################################################################
REM # CONFIGURE THE BELOW SETTINGS ONLY
REM # DATA_PATH - The path to the data for your foundry is installed (modules/worlds)
SET DATA_PATH=%LOCALAPPDATA%\FoundryVTT
REM # INSTALL_PATH - Path where foundry is actually installed to
SET INSTALL_PATH=C:\Program Files\FoundryVTT\resources\app
REM ###############################################################################
REM # DO NOT MODIFY ANYTHING BELOW THIS LINE
SET VERSION =  0.1.3
REM # Version  0.1.0 - Initial Version
REM #          0.1.1 - Added Admin check
REM #          0.1.2 - 0.7.2 Compatibility
REM #          0.1.3 - 0.7.5 Compatibility
SET PLUTONIUM_PATH=%DATA_PATH%\Data\modules\plutonium\server
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
SET CWD=%CD%
REM # check if foundry is installed
IF EXIST "%INSTALL_PATH%" ( CD %INSTALL_PATH% ) ELSE ( GOTO:INSTALL_ERROR )

for /f "delims=" %%a in ('Powershell -Nop -C "(Get-Content .\package.json|ConvertFrom-Json).version"') do set foundryVersion=%%a

IF %foundryVersion% == 0.7.5 (
   SET SERVER_MOD=%PLUTONIUM_PATH%\0.7.x\plutonium-backend.js
) ELSE (
   SET SERVER_MOD=%PLUTONIUM_PATH%\0.6.x\plutonium-backend.js
)

FIND "plutonium" main.js > NUL && (ECHO "Plutonium edit found") || ( CALL:INSTALL_MOD )

REM # Check if the backed file exists, if not there is an error
IF EXIST "%SERVER_MOD%" ( COPY /Y "%SERVER_MOD%" "%INSTALL_PATH%" ) ELSE ( CALL:NO_PLUTONIUM )
cd "%CWD%"
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
   
   IF %foundryVersion% == 0.7.5 (
      REM 0.7.2+
      SET var3=startupMessages
   ) ELSE (
      REM 0.6.6
      SET var3=initLogging
   )
   SET strFind="require("init")(process.argv, global.paths, %var3%);"
   REM SET "_strRepl="require("init")(process.argv, global.paths, %var3%).then(() => {      require("plutonium-backend").init();});""
   TYPE main.js | FINDSTR /v %strFind% >> %TMP_OUT%
   ECHO require("init")(process.argv, global.paths, %var3%) >> %TMP_OUT%
   ECHO         .then(() =^> { >> %TMP_OUT%
   ECHO                 require("plutonium-backend.js").init(); >> %TMP_OUT%
   ECHO         }); >> %TMP_OUT%
   MOVE /Y %TMP_OUT% main.js > NUL
:NO_ADMIN
PAUSE
