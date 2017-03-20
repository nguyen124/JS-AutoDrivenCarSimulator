define(['Tile','GrassTile','BrickTile'],function(Tile,GrassTile,BrickTile){
	Tile.grassTile = new GrassTile(0);
	Tile.brickTile = new BrickTile(1);
	return Tile;
});