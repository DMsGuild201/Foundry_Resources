let folderType = "JournalEntry";
let sortingType = "m"

for(let folder of game.folders.values()){
    if(folder.data.type == folderType){
        folder.update({sorting: sortingType})
    }
}
