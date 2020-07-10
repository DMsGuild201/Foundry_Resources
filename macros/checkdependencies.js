(async () => {
 const gdm = game.data.modules, ebl = gdm.filter(m => !m.active).filter(m => game.data.world.dependencies.some(x => x.name === m.id)), miss = game.data.world.dependencies.filter(x => !gdm.some(m => m.id === x.name))

 if (!miss.length && !ebl.length) return ui.notifications.info(`All dependencies are active!`)

 const srt = (a, b) => (a = a.toLowerCase(), b = b.toLowerCase(), a === b ? 0 : b < a ? 1 : -1)

 ebl.sort((a, b) => srt(a.data.name, b.data.name))
 miss.sort((a, b) => srt(a.name, b.name))

 $(document)
  .off("click.gdi")
  .on("click.gdi", `[data-gdi]`, async () => {
   msg.delete()
   let err = 0
   SceneNavigation._onLoadProgress("Installing", 0)
   for (let i = 0; i < miss.length; ++i) {
    try {await SetupConfiguration.installPackage({manifest: miss[i].manifest})}
    catch (e) {err++; console.error(e)}
    SceneNavigation._onLoadProgress("Installing", ((i + 1) / miss.length) * 100)
   }
   const inst = miss.length - err
   ui.notifications[err ? "error" : "info"](`${inst} module(s) installed.${err ? ` ${err} error(s) (see the console).` : ""}`)
   if (!err && inst) game.shutDown()
  })
  .off("click.gde")
  .on("click.gde", `[data-gde]`, async () => {
   msg.delete()
   const m = "core", k = "moduleConfiguration", s = game.settings.get(m, k)
   ebl.forEach(it => s[it.data.name] = true)
   await game.settings.set(m, k, s)
   location.reload()
  })

 const msg = await ChatMessage.create({
  content: `<div>
<p><b>Missing Dependencies</b></p>
${miss.map(x => `<p><a href="${x.manifest}">${x.name} (${x.version})</a></p>`).join("") || "<p><i>(None)</i></p>"}
${miss.length ? `<p><button data-gdi="1">Install All</button></p>` : ""}
<hr>
<p><b>Dependencies to Enable</b></p>
${ebl.map(it => `<p>${it.data.title} (${it.data.version})</p>`).join("") || "<p><i>(None)</i></p>"}
${ebl.length ? `<p><button data-gde="1">Enable All</button></p>` : ""}
</div>`,
  type: 4,
  whisper: [game.userId]
 })
})()
