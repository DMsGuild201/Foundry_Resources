// USE a HitDice without shortresting 
(async () => {
    if (canvas.tokens.controlled.length !== 1) return ui.notifications.warn(`Please select exactly one token!`);

    const actor = canvas.tokens.controlled[0].actor;
    if (!actor) return ui.notifications.warn(`Please select an actor with a token!`);

    const classItems = actor.data.items.filter(it => it.type === "class")
    if (!classItems.length) return ui.notifications.warn(`Actor has no class!`);

    if (classItems.length > 1) return ui.notifications.warn(`Actor has multiple classes! This is not (yet) supported.`);

    const classItem = classItems[0];

    if (classItem.data.hitDiceUsed >= classItem.data.levels) return ui.notifications.warn(`You have no remaining hit dice to spend!`);

    const classItemUpdate = {
        _id: classItem._id,
        data: {
            hitDiceUsed: classItem.data.hitDiceUsed + 1,
        },
    };

    await actor.updateEmbeddedEntity("OwnedItem", classItemUpdate);

    const hitDieRoll = new Roll(`1${classItem.data.hitDice} + ${actor.data.data.abilities.con.mod}`);
    hitDieRoll.roll();
    hitDieRoll.toMessage(); // Post the roll to chat

    const actorUpdate = {
        data: {
            attributes: {
                hp: {
                    value: Math.clamped(
                        actor.data.data.attributes.hp.value + hitDieRoll.total,
                        actor.data.data.attributes.hp.min,
                        actor.data.data.attributes.hp.max
                    )
                },
            },
        },
    };

    await actor.update(actorUpdate);
})();
