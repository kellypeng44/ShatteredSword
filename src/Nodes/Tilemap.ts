import Vec2 from "../DataTypes/Vec2";
import Tileset from "../DataTypes/Tilesets/Tileset";
import { TiledTilemapData, TiledLayerData } from "../DataTypes/Tilesets/TiledData"
import CanvasNode from "./CanvasNode";

/**
 * The representation of a tilemap - this can consist of a combination of tilesets in one layer
 */
export default abstract class Tilemap extends CanvasNode {
    protected tilesets: Array<Tileset>;
    protected tileSize: Vec2;
    protected data: Array<number>;
    protected collisionMap: Array<boolean>;
    name: string;

    // TODO: Make this no longer be specific to Tiled
    constructor(tilemapData: TiledTilemapData, layer: TiledLayerData, tilesets: Array<Tileset>, scale: Vec2) {
        super();
        this.tilesets = tilesets;
        this.tileSize = new Vec2(0, 0);
        this.name = layer.name;

        let tilecount = 0;
        for(let tileset of tilesets){
            tilecount += tileset.getTileCount();
        }

        this.collisionMap = new Array(tilecount);
        for(let i = 0; i < this.collisionMap.length; i++){
            this.collisionMap[i] = false;
        }

        // Defer parsing of the data to child classes - this allows for isometric vs. orthographic tilemaps and handling of Tiled data or other data
        this.parseTilemapData(tilemapData, layer);
        this.scale.set(scale.x, scale.y);
    }

    /**
     * Returns an array of the tilesets associated with this tilemap
     */
    getTilesets(): Tileset[] {
        return this.tilesets;
    }

    /**
     * Returns the size of tiles in this tilemap as they appear in the game world after scaling
     */
    getTileSize(): Vec2 {
        return this.tileSize.scaled(this.scale.x, this.scale.y);
    }

    getTileSizeWithZoom(): Vec2 {
        let zoom = this.scene.getViewScale();

        return this.getTileSize().scale(zoom);
    }

    /** Adds this tilemap to the physics system */
    addPhysics = (): void => {
        this.scene.getPhysicsManager().registerTilemap(this);
    }

    /**
     * Returns the value of the tile at the specified position
     * @param worldCoords The position in world coordinates
     */
    abstract getTileAtWorldPosition(worldCoords: Vec2): number;

    /**
     * Returns the world position of the top left corner of the tile at the specified index
     * @param index 
     */
    abstract getTileWorldPosition(index: number): Vec2;

    /**
     * Returns the value of the tile at the specified index
     * @param index
     */
    abstract getTile(index: number): number;

    /**
     * Sets the value of the tile at the specified index
     * @param index
     * @param type
     */
    abstract setTile(index: number, type: number): void;

    /**
     * Sets up the tileset using the data loaded from file
     */
    // TODO: This shouldn't use tiled data specifically - it should be more general
    protected abstract parseTilemapData(tilemapData: TiledTilemapData, layer: TiledLayerData): void;
}