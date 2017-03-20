define(['Jquery','Class'],function($,Class){
	var canvas, title, width, height, graphics;
	var Display = Class.extend({
		init: function(_title,_width,_height){
			title = _title;
			width = _width;
			height = _height;
			createDisplay();
		},
		getTitle : function(){ 
			return title;
		},
		getWidth : function(){ 
			return width;
		},
		getHeight : function(){
			return height;
		},
		getGraphics : function(){
			return graphics;
		}		
	});
	function createDisplay(){
		document.title = title;
		var body = document.body;
		var canvas = document.createElement("canvas");
		canvas.setAttribute("id","canvas");
		canvas.setAttribute("width",width);
		canvas.setAttribute("height",height);
		canvas.style.border = "1px solid #000";
		body.appendChild(canvas);
		graphics = canvas.getContext("2d");
	}
	
	CanvasRenderingContext2D.prototype.drawSprite = function(asset,_x,_y,_width,_height){
		this.drawImage(asset.sheet,asset.x,asset.y,asset.width,asset.height,_x,_y,_width,_height);
	}
	return Display;
});