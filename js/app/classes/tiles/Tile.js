define(['Class', 'Assets'], function (Class, Assets) {
	var TILE_WIDTH = 16,
	TILE_HEIGHT = 16;
	var tiles = [];
	Tile = Class.extend({
			init: function (_texture, _id) {
				this.texture = _texture;
				this.id = _id;
				tiles[_id] = this;
			},
			tick: function (_dt) {},
			render: function (_g, _x, _y) {
				_g.drawSprite(this.texture, _x, _y, TILE_WIDTH, TILE_HEIGHT);
			},
			getId: function () {
				return this.id;
			},
			isSolid: function () {
				return false;
			}
		});
	Tile.tiles = tiles;
	Tile.TILE_WIDTH = TILE_WIDTH;
	Tile.TILE_HEIGHT = TILE_HEIGHT;
	Tile.assets = Assets.getAssets('SpriteSheet');
	return Tile;
})
