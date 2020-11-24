import Tilemap from "../Tilemap";
import Vec2 from "../../DataTypes/Vec2";
import { TiledTilemapData, TiledLayerData } from "../../DataTypes/Tilesets/TiledData";
import Tileset from "../../DataTypes/Tilesets/Tileset";

/**
 * The representation of an orthogonal tilemap - i.e. a top down or platformer tilemap
 */
export default class OrthogonalTilemap extends Tilemap {

    protected numCols: number;
    protected numRows: number;

    /**
     * Parses the tilemap data loaded from the json file. DOES NOT process images automatically - the ResourceManager class does this while loading tilemaps
     * @param tilemapData 
     * @param layer 
     */
    protected parseTilemapData(tilemapData: TiledTilemapData, layer: TiledLayerData): void {
        // The size of the tilemap in local space
        this.numCols = tilemapData.width;
        this.numRows = tilemapData.height;

        // The size of tiles
        this.tileSize.set(tilemapData.tilewidth, tilemapData.tileheight);

        // The size of the tilemap on the canvas
        this.size.set(this.numCols * this.tileSize.x, this.numRows * this.tileSize.y);
        this.position.copy(this.size);
        this.data = layer.data;
        this.visible = layer.visible;

        // Whether the tilemap is collidable or not
        this.isCollidable = false;
        if(layer.properties){
            for(let item of layer.properties){
                if(item.name === "Collidable"){
                    this.isCollidable = item.value;

                    // Set all tiles besides "empty: 0" to be collidable
                    for(let i = 1; i < this.collisionMap.length; i++){
                        this.collisionMap[i] = true;
                    }
                }
            }
        }
    }

    getTileAtWorldPosition(worldCoords: Vec2): number {
        let localCoords = this.getColRowAt(worldCoords);
        return this.getTileAtRowCol(localCoords);
    }

    /**
     * Get the tile at the specified row and column
     * @param rowCol 
     */
    getTileAtRowCol(rowCol: Vec2): number {
        if(rowCol.x < 0 || rowCol.x >= this.numCols || rowCol.y < 0 || rowCol.y >= this.numRows){
            return -1;
        }

        return this.data[rowCol.y * this.numCols + rowCol.x];
    }

    getTileWorldPosition(index: number): Vec2 {
        // Get the local position
        let col = index % this.numCols;
        let row = Math.floor(index / this.numCols);

        // Get the world position
        let x = col * this.tileSize.x;
        let y = row * this.tileSize.y;

        return new Vec2(x, y);
    }

    getTile(index: number): number {
        return this.data[index];
    }

    setTile(index: number, type: number): void {
        this.data[index] = type;
    }

    setTileAtRowCol(rowCol: Vec2, type: number): void {
        let index = rowCol.y * this.numCols + rowCol.x;
        this.setTile(index, type);
    }

    /**
     * Returns true if the tile at the specified row and column of the tilemap is collidable
     * @param indexOrCol 
     * @param row 
     */
    isTileCollidable(indexOrCol: number, row?: number): boolean {
        // The value of the tile
        let tile = 0;

        if(row){
            // We have a column and a row
            tile = this.getTileAtRowCol(new Vec2(indexOrCol, row));

            if(tile < 0){
                return false;
            }
        } else {
            if(indexOrCol < 0 || indexOrCol >= this.data.length){
                // Tiles that don't exist aren't collidable
                return false;
            }
            // We have an index
            tile = this.getTile(indexOrCol);
        }

        return this.collisionMap[tile];
    }

    /**
     * Takes in world coordinates and returns the row and column of the tile at that position
     * @param worldCoords 
     */
    getColRowAt(worldCoords: Vec2): Vec2 {
        let col = Math.floor(worldCoords.x / this.tileSize.x / this.scale.x);
        let row = Math.floor(worldCoords.y / this.tileSize.y / this.scale.y);

        return new Vec2(col, row);
    }

    update(deltaT: number): void {}
}