@echo off
REM ###############################################################################
REM # CONFIGURE THE BELOW SETTINGS ONLY
REM # DATA_PATH - The path to the data for your foundry is installed (modules/worlds)
SET DATA_PATH=%LOCALAPPDATA%\FoundryVTT
REM # INSTALL_PATH - Path where foundry is actually installed to
SET INSTALL_PATH=C:\Program Files\FoundryVTT\resources\app
REM ###############################################################################
REM # DO NOT MODIFY ANYTHING BELOW THIS LINE
SET VERSION =  0.1.2
REM # Version  0.1.0 - Initial Version
REM #          0.1.1 - Added Admin check
REM #          0.1.2 - 0.7.2 Compatibility
SET PLUTONIUM_PATH=%DATA_PATH%\Data\modules\plutonium\server
SET SERVER_MOD=%PLUTONIUM_PATH%\plutonium-backend.js
SET miniorVersion=0.6.6
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
   for /f "delims=" %%a in ('Powershell -Nop -C "(Get-Content .\package.json|ConvertFrom-Json).version"') do set foundryVersion=%%a
   SET TMP_OUT=main.js.new
   
   CALL :compareVersions %miniorVersion% %foundryVersion%
   IF %errorlevel% == -1 (
      REM 0.7.2+
      SET var3=startupMessages
   ) ELSE (
      SET var3=initLogging
   )
   SET strFind="require("init")(process.argv, global.paths, %var3%);"
   REM SET "_strRepl="require("init")(process.argv, global.paths, %var3%).then(() => {      require("plutonium-backend").init();});""
   TYPE main.js | FINDSTR /v %strFind% >> %TMP_OUT%
   ECHO require("init")(process.argv, global.paths, %var3%) >> %TMP_OUT%
   ECHO         .then(() =^> { >> %TMP_OUT%
   ECHO                 require("plutonium-backend").init(); >> %TMP_OUT%
   ECHO         }); >> %TMP_OUT%
   MOVE /Y %TMP_OUT% main.js > NUL
:compareVersions  version1  version2
REM
REM Compares two version numbers and returns the result in the ERRORLEVEL
REM
REM Returns 1 if version1 > version2
REM         0 if version1 = version2
REM        -1 if version1 < version2
REM
REM The nodes must be delimited by . or , or -
REM
REM Nodes are normally strictly numeric, without a 0 prefix. A letter suffix
REM is treated as a separate node
REM
setlocal enableDelayedExpansion
set "v1=%~1"
set "v2=%~2"
call :divideLetters v1
call :divideLetters v2
:loop
call :parseNode "%v1%" n1 v1
call :parseNode "%v2%" n2 v2
if %n1% gtr %n2% exit /b 1
if %n1% lss %n2% exit /b -1
if not defined v1 if not defined v2 exit /b 0
if not defined v1 exit /b -1
if not defined v2 exit /b 1
goto :loop


:parseNode  version  nodeVar  remainderVar
for /f "tokens=1* delims=.,-" %%A in ("%~1") do (
  set "%~2=%%A"
  set "%~3=%%B"
)
exit /b


:divideLetters  versionVar
for %%C in (a b c d e f g h i j k l m n o p q r s t u v w x y z) do set "%~1=!%~1:%%C=.%%C!"
exit /b
:NO_ADMIN
PAUSE
