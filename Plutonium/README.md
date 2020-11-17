

# Tools and scripts for helping with the Module "Plutonium" for FoundryVTT.


### updatemain
>  This script is to be run after updating Foundry main system; or in troubleshooting the backend for Plutonium.
>  Be sure to edit the top of the files to point to your Foundry Installation and data directories, as Foundry does not install environment variables for reference by third party applications/scripts
>  The Windows script requires administrator rights, either right click the file and select run as administrator, or run command prompt as administrator to run the script.
>  Requires BASH to be installed for the Linux/Unix script, which most distros have by default.

*  *updateMain.bash* is for [mac/unix](https://www.cyberciti.biz/faq/run-execute-sh-shell-script/)  

*  *updateMain.bat* is for [windows](https://fossbytes.com/batch-file-run-as-administrator-windows/#:~:text=Right%2Dclick%20on%20your%20batch,Click%20Create%20Shortcut&text=Right%2Dclick%20the%20shortcut%20file,Check%20the%20Run%20As%20Administrator&text=Click%20Ok%20to%20close%20the%20dialog%20box) 
How to use: copy the relevant file to your installation location; update paths at the top of the script; login as admin or, for windows, launch shell as admin then execute

### renameFoundryWorlds.py
> This script is intended for Dungeon Masters who want to rename their worlds, or have multiple active copies of the same world.  Foundry does not allow you just to rename a world willy nilly, and it requires you to fix all of the links in the JSON and database files for image paths and such.  This script does all of that for the user.
> Before using this script, we highly recommend that DMs attempt to use compendiums to share/backup data, convert worlds as modules (compendiums), duplicate the stuff they want copies of (scenes, actors, etc..), or other built in foundry tools to prevent data loss.  We are not responsible for any data loss while using this script.
> Before using this script, ensure the "foundry_data" path is set correctly in the user editable area.  If you don't know what or how to do that, we encourage you again to use other foundry tools to get around your issue.  This is intended for users who have a higher than average technical knowledge.
> Backups of the modified files are stored in the same directory in which they were modified, with the ".bak" suffix.
> A list of all the files found and modified will be printed to the screen with their full path.
> To execute the script perform the command "python renameFoundryWorlds.py" in a terminal/command/powershell window.
> Python version 3.5+ is required.

* *renameFoundryWorlds.py* is for both Windows and Linux.  It does not require administrative permissions to run, however it requires Python version 3.5+.

