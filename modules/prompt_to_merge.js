Hooks.on("init", () => {
	game.settings.register("<module_name>", "imported", {
		scope: "world",
		config: false,
		type: Boolean,
		default: false
	});
})

Hooks.on("renderCompendium", (app, html, data) => {
	if ( data.collection.startsWith("cycle-of-cerberus.") && !game.settings.get("cycle-of-cerberus", "imported") ) {
		Dialog.confirm({
			title: "<module TILE> Importer",
			content: "<p>Welcome to the <strong><module TILE></strong> adventure module. Would you like to import all adventure content to your World?",
			yes: () => importLabors()
		});
	}
});

/**
 * Import content for all the labors
 */
async function importLabors() {
	const module = game.modules.get("<module_name>");
	let scenes = null;
	let actors = null;

	for ( let p of module.packs ) {
		const pack = game.packs.get("<module_name>."+p.name);
		if ( p.entity !== "Playlist" ) await pack.importAll();
		else {
			const music = await pack.getContent();
			Playlist.create(music.map(p => p.data));
		}
		if ( p.entity === "Scene" ) scenes = game.folders.getName(p.label);
		if ( p.entity === "Actor" ) actors = game.folders.getName(p.label);
	}

	// Re-associate Tokens for all scenes
	const sceneUpdates = [];
	for ( let s of scenes.entities ) {
		const tokens = s.data.tokens.map(t => {
			const a = actors.entities.find(a => a.name === t.name);
			t.actorId = a ? a.id : null;
			return t;
		});
		sceneUpdates.push({_id: s.id, tokens});
	}
	await Scene.update(sceneUpdates);

	// Activate the splash page
	const s0 = game.scenes.getName("The <module_name>");
	s0.activate();

	// Display the introduction
	const j1 = game.journal.getName("A1. Adventure Introduction");
	if ( j1 ) j1.sheet.render(true, {sheetMode: "text"});
	return game.settings.set("<module_name>", "imported", true);
}
