define(['State','Car','Map'],function(State,Car,Map){
	var x = 0, y =0;
	var GameState = State.extend({
		init:function(_handler){
			this._super(_handler);
			this.car = new Car(_handler,16*2,16*5);
			this.map = new Map("I:/SpringWorkspace/JavaScript-AutoCar/js/app/res/maps/map.txt",_handler);
		}
	})	
	
	GameState.prototype.tick = function(_dt){		
		this.car.tick(_dt);
		this.map.tick(_dt);
	}
	GameState.prototype.render = function(_g){		
		this.map.render(_g)
		this.car.render(_g);
	}
	return GameState;
});