define(['Class','ImageLoader','SpriteSheet'],function(Class,ImageLoader,SpriteSheet){
	var DEFAULT_WIDTH = 16, DEFAULT_HEIGHT = 16;
	var assets = {};
	var Assets = Class.extend({
		init:function(_name,_path,_width,_height){
			assets[_name] = this;
			this.name = _name;
			this.width = _width;
			this.height = _height;
			this.path = _path;
			this.sheet = new SpriteSheet(ImageLoader.loadImage(this.path));
		}		
	});
	Assets.DEFAULT_WIDTH = DEFAULT_WIDTH;
	Assets.DEFAULT_HEIGHT = DEFAULT_HEIGHT;
	Assets.getAssets = function(_name){
		return assets[_name];
	}
	var ast = new Assets("SpriteSheet",'js/app/res/SpriteSheet16x16.png',Assets.DEFAULT_WIDTH,Assets.DEFAULT_HEIGHT);
	ast.grass = ast.sheet.crop(0,0,16,16);
	ast.brick = ast.sheet.crop(32,0,16,16);
	ast.car = ast.sheet.crop(16*4,0,16,16);
	return Assets;
});