(() => {
    const activeModules = game.data.modules.filter(m => m.active).map((m) => ({name: m.data.name, title: m.data.title}));
    const missingModules = game.data.world.dependencies.filter(it => !activeModules.some(m => m.name === it.name));

    if (!missingModules.length) return ui.notifications.info(`All dependencies are installed!`);

    missingModules.sort((a, b) => {
        a = (a.name || "").toLowerCase();
        b = (b.name || "").toLowerCase();
        return a === b ? 0 : b < a ? 1 : -1
    });

    ChatMessage.create({
        content: `<div>
            <p><b>Missing Dependencies</b></p>
            ${missingModules.map(it => `<p><a href="${it.manifest}">${it.name} (${it.version})</a></p>`).join("")}
        </div>`,
        user: game.userId,
        type: 4,
        whisper: [game.userId]
    });
})();
