define(['Class','Rectangle'],function(Class,Rectangle){
	var Entity = Class.extend({
		init:function(_handler,_x,_y,_width,_height){
			this.x =_x;
			this.y =_y;
			this.width = _width;
			this.height = _height;
			this.handler = _handler;
			this.bounds = new Rectangle(0,0,_width,_height);
		},
		tick:function(_dt){
			
		},
		render:function(_g){
			
		},
		getX:function(){
			return this.x;
		},
		getY:function(){
			return this.y;
		},
		setX:function(_x){
			this.x = _x;
		},
		setY:function(_y){
			this.y = _y;
		},
		getWidth:function(){
			return this.width;
		},
		getHeight:function(){
			return this.height;
		},
		setWidth:function(_w){
			this.width = _w;
		},
		setHeight:function(_h){
			this.height = _h;
		}
	})
	return Entity;
});