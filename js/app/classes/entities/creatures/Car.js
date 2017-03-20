define(['Creature', 'Assets'], function (Creature, Assets) {
	var Car = Creature.extend({
			init: function (_handler, _x, _y) {
				this._super(_handler, _x, _y, Creature.DEFAULT_CREATURE_WIDTH, Creature.DEFAULT_CREATURE_HEIGHT);
				this.assets = Assets.getAssets('SpriteSheet');
				this.bounds.x = 0;
				this.bounds.y = 0;
				this.bounds.width = 16;
				this.bounds.height = 16;
				this.angle = 0;
				this.length = 32;
				this.intersections = [];
				this.sensor = {
					heads: {
						east: {
							angle: Math.PI / 2
						},
						northEast: {
							angle: Math.PI / 4
						},
						north: {
							angle: 0
						},
						northWest: {
							angle: -Math.PI / 4
						},
						west: {
							angle: -Math.PI / 2
						}
					},
					tail: {
						centerX: this.x,
						centerY: this.y
					}
				}
			},
			tick: function (_dt) {
				this.getInput(_dt);
				this.move();
				this.handler.getCamera().centerOnEntity(this);
				//this.angle = (this.angle + dt);
				this.detectIntersection();

			},
			detectIntersection: function () {
				var step = 0.1;
				for (var direction in this.sensor.heads) {
					this.intersections[direction] = {
						X: null,
						Y: null
					};
					var sensorAngle = this.sensor.heads[direction].angle;
					this.sensor.heads[direction].X = parseInt(Math.cos(this.angle + sensorAngle) * this.length);
					this.sensor.heads[direction].Y = parseInt(Math.sin(this.angle + sensorAngle) * this.length);
					var headX = this.sensor.heads[direction].X + this.x + Creature.DEFAULT_CREATURE_WIDTH / 2;
					var headY = this.sensor.heads[direction].Y + this.y + Creature.DEFAULT_CREATURE_HEIGHT / 2;
					var slope = (headY - this.y) / (headX - this.x);
					if (slope != -Infinity && slope != Infinity) {
						for (var i = headX; i < this.x; i += step) {
							var j = slope * (i - this.x) + this.y;
							var parsedI = parseInt(i / Creature.DEFAULT_CREATURE_WIDTH);
							var parsedJ = parseInt(j / Creature.DEFAULT_CREATURE_HEIGHT);
							var tile = this.handler.getMap().getTile(parsedI, parsedJ);
							if (tile != null) {
								if (tile.isSolid()) {
									this.intersections[direction] = {
										X: parseInt(i),
										Y: parseInt(j)
									}
								}
							}
						}
						for (var i = headX; i > this.x; i -= step) {
							var j = slope * (i - this.x) + this.y;
							var parsedI = parseInt(i / Creature.DEFAULT_CREATURE_WIDTH);
							var parsedJ = parseInt(j / Creature.DEFAULT_CREATURE_HEIGHT);
							var tile = this.handler.getMap().getTile(parsedI, parsedJ);
							if (tile != null) {
								if (tile.isSolid()) {
									this.intersections[direction] = {
										X: parseInt(i),
										Y: parseInt(j)
									}
								}
							}
						}
					} else {
						for (var j = headY; j < this.y; j += step) {
							var tile = this.handler.getMap().getTile(
									parseInt((headX) / Creature.DEFAULT_CREATURE_WIDTH), parseInt((j + Creature.DEFAULT_CREATURE_HEIGHT / 2) / Creature.DEFAULT_CREATURE_HEIGHT));
							if (tile != null) {
								if (tile.isSolid()) {
									this.intersections[direction] = {
										X: headX,
										Y: j
									}
								}
							}
						}
						for (var j = headY; j > this.y; j -= step) {
							var tile = this.handler.getMap().getTile(
									parseInt((headX) / Creature.DEFAULT_CREATURE_WIDTH), parseInt((j + Creature.DEFAULT_CREATURE_HEIGHT / 2) / Creature.DEFAULT_CREATURE_HEIGHT));
							if (tile != null) {
								if (tile.isSolid()) {
									this.intersections[direction] = {
										X: headX,
										Y: j
									}
								}
							}
						}
					}
				}
			},
			render: function (_g) {
				var xOffset = this.handler.getCamera().getXOffset();
				var yOffset = this.handler.getCamera().getYOffset();
				_g.save();
				_g.translate(this.x - xOffset, this.y - yOffset);
				_g.translate(this.width / 2, this.height / 2);
				_g.rotate(this.angle);
				_g.drawSprite(this.assets.car, -this.width / 2, -this.height / 2, 16, 16);
				_g.strokeStyle = "#FFFF00";
				for (var direction in this.sensor.heads) {
					_g.beginPath();
					_g.moveTo(0, 0);
					_g.lineTo(this.sensor.heads[direction].X, this.sensor.heads[direction].Y);
					_g.stroke();
				}
				_g.beginPath();
				_g.arc(0, 0, 32, 0, 2 * Math.PI);
				_g.stroke();
				_g.restore();
				
				for (var direction in this.intersections) {
					if (this.intersections[direction].X != null && this.intersections[direction].Y != null) {
						_g.save();
						var tempX = this.intersections[direction].X;
						var tempY = this.intersections[direction].Y;
						_g.translate(tempX - xOffset, tempY - yOffset);
						_g.translate(3 / 2, 3 / 2);
						_g.beginPath();
						_g.arc(0, 0, 1, 0, 2 * Math.PI);
						_g.stroke();
						_g.restore();
					}
				}
				//_g.fillRect(this.bounds.x +this.x-this.handler.getCamera().getXOffset(),this.bounds.y+this.y-this.handler.getCamera().getYOffset(),this.bounds.width,this.bounds.height);
			},
			getInput: function (_dt) {
				this.xMove = 0;
				this.yMove = 0;
				if (this.handler.getKeyManager().up) {
					this.yMove = -this.speed * _dt;
				}
				if (this.handler.getKeyManager().down) {
					this.yMove = this.speed * _dt;
				}
				if (this.handler.getKeyManager().left) {
					this.xMove = -this.speed * _dt;
				}
				if (this.handler.getKeyManager().right) {
					this.xMove = this.speed * _dt;
				}
			}
		})
		return Car;
});
