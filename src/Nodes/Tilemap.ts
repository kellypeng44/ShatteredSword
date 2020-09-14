import Vec2 from "../DataTypes/Vec2";
import GameNode from "./GameNode";
import Tileset from "../DataTypes/Tilesets/Tileset";
import { TiledTilemapData, TiledLayerData } from "../DataTypes/Tilesets/TiledData"

/**
 * The representation of a tilemap - this can consist of a combination of tilesets in one layer
 */
export default abstract class Tilemap extends GameNode {
    // A tileset represents the tiles within one specific image loaded from a file
    protected tilesets: Array<Tileset>;
    protected worldSize: Vec2;
    protected tileSize: Vec2;
    protected scale: Vec2;
    public data: Array<number>;
	public collidable: boolean;
	public visible: boolean;

    // TODO: Make this no longer be specific to Tiled
    constructor(tilemapData: TiledTilemapData, layer: TiledLayerData) {
        super();
        this.tilesets = new Array<Tileset>();
        this.worldSize = new Vec2(0, 0);
        this.tileSize = new Vec2(0, 0);

        // Defer parsing of the data to child classes - this allows for isometric vs. orthographic tilemaps and handling of Tiled data or other data
        this.parseTilemapData(tilemapData, layer);
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

    isCollidable(): boolean {
        return this.collidable;
    }

    isVisible(): boolean {
        return this.visible;
    }

    abstract getTileAt(worldCoords: Vec2): number;

    /**
     * Sets up the tileset using the data loaded from file
     */
    // TODO: This shouldn't use tiled data specifically - it should be more general
    protected abstract parseTilemapData(tilemapData: TiledTilemapData, layer: TiledLayerData): void;

    abstract render(ctx: CanvasRenderingContext2D): void;
}