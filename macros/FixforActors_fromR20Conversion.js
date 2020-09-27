let tokens = [] 
for (let token of canvas.tokens.placeables) { 
tokens.push({_id: token.id, "bar1.attribute": "attributes.hp", "bar2.attribute": "", "displayName": CONST.TOKEN_DISPLAY_MODES.OWNER, "displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER})
}
if (tokens.length > 0) canvas.scene.updateManyEmbeddedEntities('Token', tokens)
