define(['State','EntityManager','Map'],function(State,EntityManager,Map){
	var x = 0, y =0;
	var GameState = State.extend({
		init:function(_handler){
			this._super(_handler);
			this.entityManager = new EntityManager(_handler);
			this.map = new Map("I:/SpringWorkspace/JavaScript-AutoCar/js/app/res/maps/map.txt",_handler);
		}
	})	
	
	GameState.prototype.tick = function(_dt){		
		this.entityManager.tick(_dt);
		this.map.tick(_dt);
	}
	GameState.prototype.render = function(_g){		
		this.map.render(_g)
		this.entityManager.render(_g);
	}
	return GameState;
});