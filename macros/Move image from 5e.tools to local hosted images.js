{
  "name": "Localize 5eTools token images",
  "type": "script",
  "author": "kKrrDlkpfIaOdPk6",
  "img": "icons/svg/dice-target.svg",
  "scope": "global",
  "command": "for (const a of game.actors) {\n  const img = a.data.token.img.replaceAll(\"https://5e.tools\", \"modules/plutonium\");\n  if (img != a.data.token.img)\n    await a.update({\"token.img\": img});\n}\n\nfor (const t of canvas.tokens.placeables) {\n  const img = t.data.img.replaceAll(\"https://5e.tools\", \"modules/plutonium\");\n  if (img != t.data.img)\n    await t.document.update({\"img\": img});\n}",
  "sort": 0,
  "flags": {
    "advanced-macros": {
      "runAsGM": false
    },
    "exportSource": {
      "world": "test",
      "system": "dnd5e",
      "coreVersion": "0.8.8",
      "systemVersion": "1.4.2"
    }
  }
}
