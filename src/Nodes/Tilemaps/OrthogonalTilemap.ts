import Tilemap from "../Tilemap";
import Vec2 from "../../DataTypes/Vec2";
import { TiledTilemapData, TiledLayerData } from "../../DataTypes/Tilesets/TiledData";
import Tileset from "../../DataTypes/Tilesets/Tileset";

/**
 * The representation of an orthogonal tilemap - i.e. a top down or platformer tilemap
 */
export default class OrthogonalTilemap extends Tilemap {

    /**
     * Parses the tilemap data loaded from the json file. DOES NOT process images automatically - the ResourceManager class does this while loading tilemaps
     * @param tilemapData 
     * @param layer 
     */
    protected parseTilemapData(tilemapData: TiledTilemapData, layer: TiledLayerData): void {
        this.size.set(tilemapData.width, tilemapData.height);
        this.tileSize.set(tilemapData.tilewidth, tilemapData.tileheight);
        this.data = layer.data;
        this.visible = layer.visible;
        this.isCollidable = false;
        if(layer.properties){
            for(let item of layer.properties){
                if(item.name === "Collidable"){
                    this.isCollidable = item.value;
                }
            }
        }
    }

    /**
     * Get the value of the tile at the coordinates in the vector worldCoords
     * @param worldCoords 
     */
    getTileAt(worldCoords: Vec2): number {
        let localCoords = this.getColRowAt(worldCoords);
        if(localCoords.x < 0 || localCoords.x >= this.size.x || localCoords.y < 0 || localCoords.y >= this.size.y){
            // There are no tiles in negative positions or out of bounds positions
            return 0;
        }

        return this.data[localCoords.y * this.size.x + localCoords.x]
    }

    /**
     * Returns true if the tile at the specified row and column of the tilemap is collidable
     * @param indexOrCol 
     * @param row 
     */
    isTileCollidable(indexOrCol: number, row?: number): boolean {
        let index = 0;
        if(row){
            if(indexOrCol < 0 || indexOrCol >= this.size.x || row < 0 || row >= this.size.y){
                // There are no tiles in negative positions or out of bounds positions
                return false;
            }
            index = row * this.size.x + indexOrCol;
        } else {
            if(indexOrCol < 0 || indexOrCol >= this.data.length){
                // Tiles that don't exist aren't collidable
                return false;
            }
            index = indexOrCol;
        }

        // TODO - Currently, all tiles in a collidable layer are collidable
        return this.data[index] !== 0 && this.isCollidable;
    }

    /**
     * Takes in world coordinates and returns the row and column of the tile at that position
     * @param worldCoords 
     */
    // TODO: Should this throw an error if someone tries to access an out of bounds value?
    getColRowAt(worldCoords: Vec2): Vec2 {
        let col = Math.floor(worldCoords.x / this.tileSize.x / this.scale.x);
        let row = Math.floor(worldCoords.y / this.tileSize.y / this.scale.y);
        return new Vec2(col, row);
    }

    update(deltaT: number): void {}

    // TODO: Don't render tiles that aren't on screen
    render(ctx: CanvasRenderingContext2D) {
        let previousAlpha = ctx.globalAlpha;
        ctx.globalAlpha = this.getLayer().getAlpha();
        
        let origin = this.getViewportOriginWithParallax();
        let zoom = this.getViewportScale();

        if(this.visible){
            for(let i = 0; i < this.data.length; i++){
                let tileIndex = this.data[i];

                for(let tileset of this.tilesets){
                    if(tileset.hasTile(tileIndex)){
                        tileset.renderTile(ctx, tileIndex, i, this.size, origin, this.scale, zoom);
                    }
                }
            }
        }

        ctx.globalAlpha = previousAlpha;
    }
}