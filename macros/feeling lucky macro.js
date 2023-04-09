(async () => {
    const {monster} = await DataUtil.monster.loadJSON();

    const cr = await InputUiUtil.pGetUserEnum({
        values: Parser.CRS,
        isResolveItem: true,
        title: "Select a CR",
    });
    if (cr == null) return;

    const environments = monster
        .map(({environment}) => environment || [])
        .flat()
        .unique()
        .sort(SortUtil.ascSortLower);

    const env = await InputUiUtil.pGetUserEnum({
        values: environments,
        isResolveItem: true,
        title: "Select an Environment",
    });
    if (env == null) return;

    const mon = RollerUtil.rollOnArray(
        monster
            .filter(({cr, environment}) => (cr?.cr || cr) === cr && (environment || []).includes(env))
    );
    if (!mon) return;

    const importSummary = await game.modules.get("plutonium").api.importer.creature.pImportEntry(mon);
    ui.notifications.info(`Imported "${importSummary.imported[0].document.name}"!`);
    importSummary.imported[0].document.sheet.render(true);
})()