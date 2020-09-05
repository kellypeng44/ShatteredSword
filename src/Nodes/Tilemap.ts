import Vec2 from "../DataTypes/Vec2";
import GameNode from "./GameNode";
import Tileset from "../DataTypes/Tilesets/Tileset";
import { TiledTilemapData, TiledLayerData } from "../DataTypes/Tilesets/TiledData"
import TileLayer from "../DataTypes/Tilesets/TileLayer";

/**
 * Represents one layer of tiles
 */
export default abstract class Tilemap extends GameNode {
    protected tilesets: Array<Tileset>;
    protected worldSize: Vec2;
    protected tileSize: Vec2;
    protected scale: Vec2;
    protected layers: Array<TileLayer>;

    // TODO: Make this no longer be specific to Tiled
    constructor(tilemapData: TiledTilemapData) {
        super();
        this.tilesets = new Array<Tileset>();
        this.worldSize = new Vec2(0, 0);
        this.tileSize = new Vec2(0, 0);
        this.parseTilemapData(tilemapData);
        this.scale = new Vec2(4, 4);
    }

    getTilesets(): Tileset[] {
        return this.tilesets;
    }

    getWorldSize(): Vec2 {
        return this.worldSize;
    }

    getTileSize(): Vec2 {
        return this.tileSize.clone().scale(this.scale.x, this.scale.y);
    }

    getScale(): Vec2 {
        return this.scale;
    }

    setScale(scale: Vec2): void {
        this.scale = scale;
    }

    abstract getTileAt(worldCoords: Vec2): number;

    /**
     * Sets up the tileset using the data loaded from file
     */
    // TODO: This shouldn't use tiled data specifically - it should be more general
    protected abstract parseTilemapData(tilemapData: TiledTilemapData): void;

    abstract render(ctx: CanvasRenderingContext2D, origin: Vec2, viewportSize: Vec2): void;
}