import Vec2 from "../DataTypes/Vec2";
import GameNode from "./GameNode";
import Tileset from "../DataTypes/Tilesets/Tileset";
import { TiledTilemapData, TiledLayerData } from "../DataTypes/Tilesets/TiledData"

/**
 * Represents one layer of tiles
 */
export default abstract class Tilemap extends GameNode {
    protected data: number[];
    protected tilesets: Tileset[];
    protected worldSize: Vec2;
    protected tileSize: Vec2;

    constructor(tilemapData: TiledTilemapData, layerData: TiledLayerData){
        super();
        this.tilesets = new Array<Tileset>();
        this.worldSize = new Vec2(0, 0);
        this.tileSize = new Vec2(0, 0);
        this.parseTilemapData(tilemapData, layerData);
    }

    getTilesets(): Tileset[] {
        return this.tilesets;
    }

    getWorldSize(): Vec2 {
        return this.worldSize;
    }

    getTileSize(): Vec2 {
        return this.tileSize;
    }

    isReady(): boolean {
        if(this.tilesets.length !== 0){
            for(let tileset of this.tilesets){
                if(!tileset.isReady()){
                    return false;
                }
            }
        }
        return true;
    }

    abstract forEachTile(func: Function): void;

    /**
     * Sets up the tileset using the data loaded from file
     */
    abstract parseTilemapData(tilemapData: TiledTilemapData, layerData: TiledLayerData): void;

    abstract render(ctx: CanvasRenderingContext2D, origin: Vec2, viewportSize: Vec2): void;
}