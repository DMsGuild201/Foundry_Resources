 function wallUpdate(data) {
   canvas.walls.controlled.map(wall => wall.update(data));
 }
 
 let dialogEditor = new Dialog({
  title: `Wall Type Picker`,
  content: `Pick the type of wall to change the selected wall to.`,
  buttons: {
    blockMove: {
      label: `Block Movement`,
      callback: () => {
        wallUpdate({"move": CONST.WALL_MOVEMENT_TYPES.NORMAL});
        dialogEditor.render(true);
      }
    },
    allowMove: {
      label: `Allow Movement`,
      callback: () => {
        wallUpdate({"move": CONST.WALL_MOVEMENT_TYPES.NONE});
        dialogEditor.render(true);
      }
    },
    blockPer: {
      label: `Block Perception`,
      callback: () => {
        wallUpdate({"sense": CONST.WALL_SENSE_TYPES.NORMAL});
        dialogEditor.render(true);
      }
    },
    limitPer: {
      label: `Limited Perception`,
      callback: () => {
        wallUpdate({"sense": CONST.WALL_SENSE_TYPES.LIMITED});
        dialogEditor.render(true);
      }
    },
    allowPer: {
      label: `Allow Perception`,
      callback: () => {
        wallUpdate({"sense": CONST.WALL_SENSE_TYPES.NONE});
        dialogEditor.render(true);
      }
    },
    isDoor: {
      label: `Make Door`,
      callback: () => {
        wallUpdate({"door": CONST.WALL_DOOR_TYPES.DOOR});
        dialogEditor.render(true);
      }
    },
    close: {
      icon: "<i class='fas fa-tick'></i>",
      label: `Close`
     },
   },
   default: "close",
   close: () => {}
 });
 
 dialogEditor.render(true)
</div>
</div>
