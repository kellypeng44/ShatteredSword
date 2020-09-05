import Tilemap from "../Tilemap";
import Vec2 from "../../DataTypes/Vec2";
import { TiledTilemapData, TiledLayerData } from "../../DataTypes/Tilesets/TiledData";
import Tileset from "../../DataTypes/Tilesets/Tileset";
import TileLayer from "../../DataTypes/Tilesets/TileLayer";


export default class OrthogonalTilemap extends Tilemap {

    protected parseTilemapData(tilemapData: TiledTilemapData): void {
        this.worldSize.set(tilemapData.width, tilemapData.height);
        this.tileSize.set(tilemapData.tilewidth, tilemapData.tileheight);
        for(let layerData of tilemapData.layers){
            let layer = new TileLayer();
            layer.data = layer.data;
            layer.visible = layer.visible;
            layer.collidable = false;
            if(layerData.properties){
                for(let item of layerData.properties){
                    if(item.name === "Collidable"){
                        layer.collidable = item.value;
                    }
                }
            }
            this.layers.push(layer);
        }

        tilemapData.tilesets.forEach(tilesetData => this.tilesets.push(new Tileset(tilesetData)));
    }

    // TODO - Should this even work as it currently does? The layers make things more complicated
    getTileAt(worldCoords: Vec2): number {
        let localCoords = this.getColRowAt(worldCoords);
        if(localCoords.x < 0 || localCoords.x >= this.worldSize.x || localCoords.y < 0 || localCoords.y >= this.worldSize.y){
            // There are no tiles in negative positions or out of bounds positions
            return 0;
        }

        // Return the top nonzero tile
        let tile = 0;
        for(let layer of this.layers){
            if(layer.data[localCoords.y * this.worldSize.x + localCoords.x] !== 0){
                tile = layer.data[localCoords.y * this.worldSize.x + localCoords.x];
            }
        }
        return tile;
    }

    isTileCollidable(indexOrCol: number, row?: number): boolean {
        let index = 0;
        if(row){
            if(indexOrCol < 0 || indexOrCol >= this.worldSize.x || row < 0 || row >= this.worldSize.y){
                // There are no tiles in negative positions or out of bounds positions
                return false;
            }
            index = row * this.worldSize.x + indexOrCol;
        } else {
            if(indexOrCol < 0 || indexOrCol >= this.layers[0].data.length){
                // Tiles that don't exist aren't collidable
                return false;
            }
            index = indexOrCol;
        }

        for(let layer of this.layers){
            if(layer.data[index] !== 0 && layer.collidable){
                return true;
            }
        }

        return false;
    }

    // TODO: Should this throw an error if someone tries to access an out of bounds value?
    getColRowAt(worldCoords: Vec2): Vec2 {
        let col = Math.floor(worldCoords.x / this.tileSize.x / this.scale.x);
        let row = Math.floor(worldCoords.y / this.tileSize.y / this.scale.y);
        return new Vec2(col, row);
    }

    update(deltaT: number): void {}

    // TODO: Don't render tiles that aren't on screen
    render(ctx: CanvasRenderingContext2D, origin: Vec2, viewportSize: Vec2) {
        for(let layer of this.layers){
            if(layer.visible){
                for(let i = 0; i < layer.data.length; i++){
                    let tileIndex = layer.data[i];

                    for(let tileset of this.tilesets){
                        if(tileset.hasTile(tileIndex)){
                            tileset.renderTile(ctx, tileIndex, i, this.worldSize, origin, this.scale);
                        }
                    }
                }
            }
        }
    }
}