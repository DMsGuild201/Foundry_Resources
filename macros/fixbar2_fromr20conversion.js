// Remove bar 2 for all tokens on map.
const tokens = canvas.tokens.placeables.map(token => {
  return {
    _id: token.id,
    "bar2.attribute": "None",
  };
});
canvas.scene.updateEmbeddedEntity('Token', tokens)I was interested in getting this working myself so I modified the script in the community macro module:
// Remove bar 2 for all tokens on map.
const tokens = canvas.tokens.placeables.map(token => {
  return {
    _id: token.id,
    "bar2.attribute": "None",
  };
});
canvas.scene.updateEmbeddedEntity('Token', tokens)
