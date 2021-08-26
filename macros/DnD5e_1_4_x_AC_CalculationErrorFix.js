    const changeNPC = canvas.tokens.placeables.filter(t => t.actor.type === "npc")
    
    // set no vision
    let falseVision = changeNPC.map(t => ({ _id: t.id, vision: false }))
    await canvas.tokens.updateMany(falseVision)
    ui.notifications.notify("Done (1/3): Vision");
    // on map force the ac to an integer instead of a string
    let fixAC = changeNPC.map(t=> ({_id: t.actor.id,
        "data.attributes.ac.base": parseInt(t.actor.data.data.attributes.ac.base),
        "data.attributes.ac.flat": parseInt(t.actor.data.data.attributes.ac.flat),
    }));
    await Actor.updateDocuments(fixAC);
    ui.notifications.notify("Done (2/3): NPC Map");
    
    // for all monsters we changed on map change in world
    for(let t of changeNPC) {
        let thisMonster = {
            "data.attributes.ac.base": parseInt(t.actor.data.data.attributes.ac.base),
            "data.attributes.ac.flat": parseInt(t.actor.data.data.attributes.ac.flat), 
        }
        await t.actor.update(thisMonster);
    }
    ui.notifications.notify("Done (3/3): NPC World");
