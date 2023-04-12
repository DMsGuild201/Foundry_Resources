(async () => {
    const ACTOR_NAME = "<actor's name>";

    const act = game.actors.getName(ACTOR_NAME);
    await act.updateEmbeddedDocuments(
        "Item",
        act.items.filter(it => it.type === "subclass")
            .map(sc => {
                if (!sc.flags.srd5e?.hashSubclass) return null;

                return {
                    _id: sc.id,
                    flags: {
                        plutonium: {
                            ...sc.flags.srd5e,
                            page: "subclass",
                            source: sc.flags.srd5e.sourceSubclass,
                            hash: sc.flags.srd5e.hashSubclass,
                        },
                    },
                };
            })
            .filter(Boolean),
    );

    ui.notifications.info(`Updated "${ACTOR_NAME}"!`);
})();
