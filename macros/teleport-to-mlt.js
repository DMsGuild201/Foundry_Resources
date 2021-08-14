(async () => {
  const colorArray = [
    "#7AAAE0", // Jordy Blue
    "#44BB99", // Puerto Rico
    "#C2D62E", // Fuego
    "#9FB70A", // Citrus
    "#EEDD82", // Light Goldenrod
    "#F38653", // Crusta
    "#FFB6C1", // Light Pink
    "#9BDDFF", // Columbia Blue
  ];

  const tps = canvas.notes.placeables.filter((n) => n.data.flags?.teleport);
  const seen = [];
  const mlts = [];

  let colorCount = 0;

  for (let tp of tps) {
    if (seen.includes(tp.data._id)) continue;
    seen.push(tp.data._id);

    const partner = tps.find(
      (t) => t.data._id == tp.data.flags.teleport.noteTo
    );

    if (!partner) {
      ui.notifications.warn(`A teleporter has no pair - check console`);
      console.log(
        `A note (${tp.data._id} - ${tp.data.text}) has no partner in this scene. Skipping MLT Drawing.`
      );
      console.log(tp);
      continue;
    }

    seen.push(partner.data._id);

    const tID = randomID(20);

    for (let n of [tp, partner]) {
      const newDrawing = await Drawing.create({
        type: CONST.DRAWING_TYPES.RECTANGLE,
        author: game.user._id,
        x:
          Math.floor(n.data.x / canvas.scene.data.grid) *
          canvas.scene.data.grid,
        y:
          Math.floor(n.data.y / canvas.scene.data.grid) *
          canvas.scene.data.grid,
        width: canvas.scene.data.grid,
        height: canvas.scene.data.grid,
        hidden: true,
        fontSize: 72,
        text: "↝",
        fillType: CONST.DRAWING_FILL_TYPES.SOLID,
        fillColor: colorArray[colorCount],
        fillAlpha: 1,
        strokeWidth: 1,
        strokeColor: "#000000",
        strokeAlpha: 1,
        flags: {
          "multilevel-tokens": {
            in: true,
            out: true,
            local: true,
            teleportId: tID,
          },
        },
      });
      mlts.push(newDrawing);
    }
    colorCount < colorArray.length ? colorCount++ : (colorCount = 0);
  }
})();
