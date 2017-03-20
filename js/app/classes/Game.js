define(['Class', 'Display', 'State', 'GameState','KeyManager','Handler','Camera'], function (Class, Display, State, GameState, KeyManager, Handler, Camera) {
	var _this;
	var title,width,height,g,display,keyManager, handler, camera;
	var gameState,pauseState;
	var running = false;
	var x = 0, y = 0;
	
	//var img = ImageLoader.loadImage('js/app/res/SpriteSheet16x16.png'); ;
	var Game = Class.extend({
			init: function (_title, _width, _height) {
				_this = this;
				title = _title;
				width = _width;
				height = _height;
				keyManager = new KeyManager();
			},
			getWidth : function(){
				return width;
			},
			getHeight : function(){
				return height;
			},
			getKeyManager : function(){
				return keyManager;
			},
			getCamera : function(){
				return camera;
			}
		})
	function init() {
		display = new Display(title, width, height);
		g = display.getGraphics();
		handler = new Handler(_this);
		gameState = new GameState(handler);
		camera = new Camera(handler,0,0);
		State.setState(gameState);		
	}
	function tick(_td) {
		keyManager.tick();
		if(State.getState()!=null){
			State.getState().tick(_td);
		}
	}
	function render() {
		g.clearRect(0, 0, width, height);
		//g.fillRect(20+x,20,200,250);
		//g.drawSprite(img, 0, 0, 16, 16);
		if(State.getState()!=null){
			State.getState().render(g);
		}
	}
	Game.prototype.start = function () {
		if (running) {
			return;
		}
		running = true;
		this.run();
	}
	Game.prototype.run = function () {
		init();
		var fps = 30;
		var timePerTick = 1000 / fps;
		var now;
		var lastTime = Date.now();
		var timer = 0;
		var ticks = 0;
		function loop() {
			if (running) {
				now = Date.now();
				delta = now - lastTime;
				timer += delta;
				lastTime = now;
			}
			if (timer >= timePerTick) {
				dt = timer / 1000;
				tick(dt);
				render();
				timer = 0;
			}
			window.requestAnimationFrame(loop);
		}
		loop();
	}
	
	
	return Game;
});
