define(['Class'],function(Class){
	var game, map;
	var Handler = Class.extend({
		init:function(_game){
			game = _game;
		},
		getWidth : function(){
			return game.getWidth();		
		},
		getHeight : function(){
			return game.getHeight();		
		},
		getKeyManager : function(){
			return game.getKeyManager();
		},
		getCamera : function(){
			return game.getCamera();
		},
		getMap : function(){
			return map;
		},
		setMap : function(_map){
			map = _map;
		}
		
	})		
	return Handler;
});