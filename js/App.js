requirejs.config({
	"baseUrl": "js",
	"paths": {
		//libs
		"Class": "libs/class",
		"Jquery": "libs/jquery-3.1.1.min",
		//Classes
		"Assets":"app/classes/gfx/Assets",
		"Camera":"app/classes/gfx/Camera",
		"Car":"app/classes/entities/creatures/Car",		
		"Creature":"app/classes/entities/creatures/Creature",
		"Display": "app/classes/display/Display",
		"Entity":"app/classes/entities/Entity",
		"EntityManager":"app/classes/entities/EntityManager",
		"Game": "app/classes/Game",		
		"GeneticAlgorithm": "app/classes/algorithm/GeneticAlgorithm",		
		"Genome": "app/classes/algorithm/Genome",		
		"GameState":"app/classes/states/GameState",
		"Handler": "app/classes/Handler",
		"ImageLoader":"app/classes/gfx/Imageloader",
		"KeyManager": "app/classes/input/KeyManager",		
		"Launcher": "app/classes/Launcher",	
		"Map": "app/classes/maps/Map",	
		"NeuralNetwork" : "app/classes/algorithm/NeuralNetwork",
		"Neuron" : "app/classes/algorithm/Neuron",
		"NeuronsLayer" : "app/classes/algorithm/NeuronsLayer",
		"SpriteSheet":"app/classes/gfx/SpriteSheet",
		"State":"app/classes/states/State",
		"Tile":"app/classes/tiles/Tile",
		"BrickTile":"app/classes/tiles/BrickTile",
		"GrassTile":"app/classes/tiles/GrassTile",
		"Rectangle":"app/classes/gfx/shapes/Rectangle",
		"TileLoader":"app/classes/tiles/TileLoader",
		"Util":"app/classes/utils/Util"
	}
});
require(['app/main']);
