define(['Creature', 'Assets'], function (Creature, Assets) {
	"use strict"
	var FEELER_COUNT = 5;
	var MAX_ROTATION_PER_SECOND = 10.0 / 180;
	var Car = Creature.extend({
			init: function (_handler, _x, _y, _neural) {
				this._super(_handler, _x, _y, Creature.DEFAULT_CREATURE_WIDTH, Creature.DEFAULT_CREATURE_HEIGHT);
				this.assets = Assets.getAssets('SpriteSheet');
				this.bounds.x = 0;
				this.bounds.y = 0;
				this.bounds.width = 16;
				this.bounds.height = 16;
				this.angle = 0;
				this.neural = _neural;
				this.feeler_length = 32;
				this.intersections = [];
				this.normalizedIntersectionDepths = [];
				this.deltaDistance = 0;
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
			setAngle(_angle) {
				this.angle = _angle;
			},
			tick: function (_dt) {
				this.getInput(_dt);
				//this.move();
				this.handler.getCamera().centerOnEntity(this);
				//this.angle = (this.angle + dt);
				this.buildSensor();
				this.detectIntersection();
				this.neural.setInput(this.normalizedIntersectionDepths);
				this.neural.update();
				var leftForce = this.neural.getOutput(0);
				var rightForce = this.neural.getOutput(1);
				// Convert the outputs to a proportion of how much to turn.
				var leftTheta = leftForce * MAX_ROTATION_PER_SECOND;
				var rightTheta = rightForce * MAX_ROTATION_PER_SECOND;
				this.angle += (leftTheta - rightTheta) * 2;
				var movingX = Math.sin(this.angle) * 100 * _dt;
				var movingY = -Math.cos(this.angle) * 100 * _dt;
				this.deltaDistance = Math.sqrt(movingX * movingX + movingY * movingY);
				this.move(parseInt(movingX), parseInt(movingY));
			},
			buildSensor: function () {
				var xOffset = this.handler.getCamera().getXOffset();
				var yOffset = this.handler.getCamera().getYOffset();
				for (var direction in this.sensor.heads) {
					var sensorAngle = Math.PI - (this.angle + this.sensor.heads[direction].angle);
					this.sensor.heads[direction].X = Math.sin(sensorAngle) * this.feeler_length + this.x;
					this.sensor.heads[direction].Y = Math.cos(sensorAngle) * this.feeler_length + this.y;
				}
			},
			detectIntersection: function () {
				var step = 0.01;
				for (var direction in this.sensor.heads) {
					this.intersections[direction] = {
						X: null,
						Y: null
					};
					var xStart = this.x + Creature.DEFAULT_CREATURE_WIDTH / 2;
					var yStart = this.y + Creature.DEFAULT_CREATURE_HEIGHT / 2;
					var xEnd = this.sensor.heads[direction].X; //+ this.x;
					var yEnd = this.sensor.heads[direction].Y; //+ this.y;
					var slope = (yStart - yEnd) / (xStart - xEnd);
					if (slope != -Infinity && slope != Infinity) {
						for (var i = xStart; i < xEnd; i += step) {
							var j = slope * (i - xEnd) + yEnd;
							var parsedI = parseInt((i + 8) / Creature.DEFAULT_CREATURE_WIDTH);
							var parsedJ = parseInt((j + 8) / Creature.DEFAULT_CREATURE_HEIGHT);
							var tile = this.handler.getMap().getTile(parsedI, parsedJ);
							if (tile != null) {
								if (tile.isSolid()) {
									this.intersections[direction] = {
										X: i,
										Y: j
									}
									break;
								}
							}
						}
						for (var i = xStart; i > xEnd; i -= step) {
							var j = slope * (i - xEnd) + yEnd;
							var parsedI = parseInt((i + 8) / Creature.DEFAULT_CREATURE_WIDTH);
							var parsedJ = parseInt((j + 8) / Creature.DEFAULT_CREATURE_HEIGHT);
							var tile = this.handler.getMap().getTile(parsedI, parsedJ);
							if (tile != null) {
								if (tile.isSolid()) {
									this.intersections[direction] = {
										X: i,
										Y: j
									}
									break;
								}
							}
						}
					} else {
						for (var j = yStart; j < yEnd; j += step) {
							var i = (xStart + 8);
							var parsedI = parseInt(i / 16);
							var parsedJ = parseInt((j + 8) / 16);
							var tile = this.handler.getMap().getTile(parsedI, parsedJ);
							if (tile != null) {
								if (tile.isSolid()) {
									this.intersections[direction] = {
										X: i,
										Y: j
									}
									break;
								}
							}
						}
						for (var j = yStart; j > this.y; j -= step) {
							var i = (xStart + 8);
							var parsedI = parseInt(i / 16);
							var parsedJ = parseInt((j + 8) / 16);
							var tile = this.handler.getMap().getTile(parsedI, parsedJ);
							if (tile != null) {
								if (tile.isSolid()) {
									this.intersections[direction] = {
										X: i,
										Y: j
									}
									break;
								}
							}
						}
					}
					if (this.intersections[direction] != null) {
						this.normalizedIntersectionDepths[direction] = 1 - (Math.sqrt(Math.pow(this.x
										 - this.intersections[direction].X, 2)
									 + Math.pow(this.y - this.intersections[direction].Y, 2)) / this.feeler_length);
					} else {
						this.normalizedIntersectionDepths[direction] = 0;
					}
				}
			},
			render: function (_g) {
				_g.strokeStyle = "#FFFF00";
				var xOffset = this.handler.getCamera().getXOffset();
				var yOffset = this.handler.getCamera().getYOffset();
				_g.save();
				_g.translate(this.x - xOffset, this.y - yOffset);
				_g.translate(this.width / 2, this.height / 2);
				_g.rotate(this.angle);
				_g.drawSprite(this.assets.car, -this.width / 2, -this.height / 2, 16, 16);
				_g.beginPath();
				_g.arc(0, 0, 32, 0, 2 * Math.PI);
				_g.stroke();
				_g.closePath();
				_g.restore();
				for (var direction in this.sensor.heads) {
					_g.beginPath();
					_g.moveTo(this.x - xOffset + Creature.DEFAULT_CREATURE_WIDTH / 2, this.y - yOffset + Creature.DEFAULT_CREATURE_HEIGHT / 2);
					_g.lineTo(this.sensor.heads[direction].X - xOffset + Creature.DEFAULT_CREATURE_WIDTH / 2, this.sensor.heads[direction].Y - yOffset + Creature.DEFAULT_CREATURE_HEIGHT / 2);
					_g.stroke();
					_g.closePath();
				}
				for (var direction in this.intersections) {
					if (this.intersections[direction].X != null && this.intersections[direction].Y != null) {
						var tempX = this.intersections[direction].X;
						var tempY = this.intersections[direction].Y;
						_g.beginPath();
						_g.arc(tempX - xOffset + Creature.DEFAULT_CREATURE_WIDTH / 2, tempY - yOffset + Creature.DEFAULT_CREATURE_HEIGHT / 2, 1, 0, 2 * Math.PI);
						_g.stroke();
						_g.closePath();
					}
				}
				//_g.translate(-this.width / 2, -this.height / 2);

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
			},
			hasFailed: function () {
				return this.collided;
			},
			clearFailure: function () {
				this.collided = false;
			},
			getDistanceDelta: function () {
				return this.deltaDistance;
			},
			attach: function (neuralNet) {
				this.neural = neuralNet;
			}
		})
		Car.FEELER_COUNT = FEELER_COUNT;
	return Car;
});
