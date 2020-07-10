let changeName;
let revertName;

let dialog = new Dialog({
  title: "New Name",
  content: `<p><label for="newname">New Name: </label><input type="text" id="newname" name="newname"></p>`,
  buttons: {
    change: {
      icon: "<i class='fas fa-check'></i>",
      label: "Change Name",
      callback: () => changeName = true,
    },
    revert: {
      icon: "<i class='fas fa-undo'></i>",
      label: "Revert Name",
      callback: () => revertName = true,
    },
    cancel: {
      icon: "<i class='fas fa-times'></i>",
      label: "Cancel",
      callback: () => changeName = false,
    },
  },
  default: "change",
  close: html => {
    if  (changeName) {
      let newName = html.find("#newname")[0].value
      for (let token of canvas.tokens.controlled) {
        let tokenType = token.actor.data.type;
        if (tokenType !== "character") {
          token.update({"name": newName});
        }
      }
    }
    if (revertName) {
      for (let token of canvas.tokens.controlled) {
        let tokenType = token.actor.data.type;
        if (tokenType !== "character") {
          let trueName = token.actor.data.name;
          token.update({"name": trueName});
        }
      }
    }
  }
});

dialog.render(true);
