define(['Entity', 'Tile'], function (Entity, Tile) {
	var DEFAULT_SPEED = 100;
	var DEFAULT_CREATURE_WIDTH = 16;
	var DEFAULT_CREATURE_HEIGHT = 16;
	var Creature = Entity.extend({
			init: function (_handler, _x, _y, _width, _height) {
				this._super(_handler, _x, _y, _width, _height);
				this.speed = DEFAULT_SPEED;
				this.xMove = 0;
				this.yMove = 0;
			},
			move: function (movingX, movingY) {
				this.moveX(movingX);
				this.moveY(movingY);
			},
			moveX: function (movingX) {
				this.xMove = movingX;
				var tempX = parseInt((this.x + this.xMove + this.bounds.x + this.bounds.width) / Tile.TILE_WIDTH);
				var tempX2 = parseInt((this.x + this.xMove + this.bounds.x) / Tile.TILE_WIDTH);
				var tempY = parseInt((this.y + this.bounds.y) / Tile.TILE_HEIGHT);
				var tempY2 = parseInt((this.y + this.bounds.y + this.bounds.height) / Tile.TILE_HEIGHT);
				if (this.xMove > 0) {
					if (!this.collisionWithTile(tempX, tempY) && !this.collisionWithTile(tempX, tempY2)) {
						this.x += this.xMove;
					}else {
						this.collided = true;
					}
				} else {
					if (!this.collisionWithTile(tempX2, tempY) && !this.collisionWithTile(tempX2, tempY2)) {
						this.x += this.xMove;
					}else{
						this.collided = true;
					}
				}
			},
			collisionWithTile(_x, _y) {
				var tile = this.handler.getMap().getTile(_x, _y);
				if(tile != null && tile!= undefined){
					return tile.isSolid();
				}
				return false;
			},
			moveY: function (movingY) {
				this.yMove = movingY
				var tempY = parseInt((this.y + this.yMove + this.bounds.y + this.bounds.height) / Tile.TILE_HEIGHT);
				var tempY2 = parseInt((this.y + this.yMove + this.bounds.y) / Tile.TILE_HEIGHT);
				var tempX = parseInt((this.x + this.bounds.x) / Tile.TILE_WIDTH);
				var tempX2 = parseInt((this.x + this.bounds.x + this.bounds.width) / Tile.TILE_WIDTH)
				if (this.yMove > 0) {
					if (!this.collisionWithTile(tempX, tempY) &&
						!this.collisionWithTile(tempX2, tempY)) {
						this.y += this.yMove;
					}else{
						this.collided = true;
					}
				} else {
					if (!this.collisionWithTile(tempX, tempY2) &&
						!this.collisionWithTile(tempX2, tempY2)) {
						this.y += this.yMove;
					}else{
						this.collided = true;
					}
				}
			},
			getSpeed: function () {
				return this.speed;
			},
			setSpeed: function (_speed) {
				this.speed = _speed;
			}
		});
	//static properties
	Creature.DEFAULT_SPEED = DEFAULT_SPEED
		Creature.DEFAULT_CREATURE_WIDTH = DEFAULT_CREATURE_WIDTH;
	Creature.DEFAULT_CREATURE_HEIGHT = DEFAULT_CREATURE_WIDTH;
	return Creature;
});
