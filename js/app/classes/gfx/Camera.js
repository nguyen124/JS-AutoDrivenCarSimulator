 define(['Class'],function(Class){
	 var xOffset, yOffset, handler;
	 var Camera = Class.extend({
		init: function(_handler,_xOffset,_yOffset){
			xOffset = _xOffset;
			yOffset = _yOffset;
			handler = _handler;
		},
		centerOnEntity:function(e){
			xOffset = e.getX()-handler.getWidth()/2;
			yOffset = e.getY()-handler.getHeight()/2;			
			//this.checkBlankSpace();
		},
		move:function(_xAmt,_yAmt){
			xOffset += _xAmt;
			yOffset += _yAmt;
			//this.checkBlankSpace();
		},
		// Getters 
		getXOffset:function(){
			return xOffset;
		},
		getYOffset:function(){
			return yOffset;
		},
		setXOffset:function(_x){
			xOffset = _x;
		},
		setYOffset:function(_y){
			yOffset = _y;
		},
		checkBlankSpace:function(){
			if(xOffset<0){
				xOffset = 0;
			}else if(xOffset > handler.getMap().getWidth()*Tile.TILE_WIDTH-handler.getWidth()){
				xOffset = handler.getMap().getWidth()*Tile.TILE_SIZE-handler.getWidth();
			}
			if(yOffset < 0){
				yOffset = 0;
			}else if(yOffset > handler.getMap().getHeight()*Tile.TILE_HEIGHT-handler.getHeight()){
				yOffset = handler.getMap().getHeight()*Tile.TILE_HEIGHT-handler.getHeight();
			}
		}
	 });
	 return Camera;	
 });