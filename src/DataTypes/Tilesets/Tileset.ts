import Vec2 from "../Vec2";
import { TiledTilesetData } from "./TiledData";

/**
 * The data representation of a Tileset for the game engine. This represents one image,
 * with a startIndex if required (as it is with Tiled using two images in one tilset).
 */
export default class Tileset {
    protected imageUrl: string;
    protected image: HTMLImageElement = null;
    protected imageSize: Vec2;
    protected startIndex: number;
    protected endIndex: number;
    protected tileSize: Vec2;
    protected numRows: number;
    protected numCols: number;

    // TODO: Change this to be more general and work with other tileset formats
    constructor(tilesetData: TiledTilesetData){
        // Defer handling of the data to a helper class
        this.initFromTiledData(tilesetData);
    }

    /**
     * Initialize the tileset from the data from a Tiled json file
     * @param tiledData The parsed object from a Tiled json file
     */
    initFromTiledData(tiledData: TiledTilesetData): void {
        this.numRows = tiledData.tilecount/tiledData.columns;
        this.numCols = tiledData.columns;
        this.startIndex = tiledData.firstgid;
        this.endIndex = this.startIndex + tiledData.tilecount - 1;
        this.tileSize = new Vec2(tiledData.tilewidth, tiledData.tilewidth);
        this.imageUrl = tiledData.image;
        this.imageSize = new Vec2(tiledData.imagewidth, tiledData.imageheight);
    }

    getImageUrl(): string {
        return this.imageUrl
    }

    getImage(): HTMLImageElement {
        return this.image;
    }

    setImage(image: HTMLImageElement){
        this.image = image;
    }

    getStartIndex(): number {
        return this.startIndex;
    }

    getTileSize(): Vec2 {
        return this.tileSize;
    }

    getNumRows(): number {
        return this.numRows;
    }

    getNumCols(): number {
        return this.numCols;
    }

    hasTile(tileIndex: number): boolean {
        return tileIndex >= this.startIndex && tileIndex <= this.endIndex;
    }

    /**
     * Render a singular tile with index tileIndex from the tileset located at position dataIndex
     * @param ctx The rendering context
     * @param tileIndex The value of the tile to render
     * @param dataIndex The index of the tile in the data array
     * @param worldSize The size of the world
     * @param origin The viewport origin in the current layer
     * @param scale The scale of the tilemap
     */
    renderTile(ctx: CanvasRenderingContext2D, tileIndex: number, dataIndex: number, worldSize: Vec2, origin: Vec2, scale: Vec2): void {
        // Get the true index
        let index = tileIndex - this.startIndex;
        let row = Math.floor(index / this.numCols);
        let col = index % this.numCols;
        let width = this.tileSize.x;
        let height = this.tileSize.y;

        // Calculate the position to start a crop in the tileset image
        let left = col * width;
        let top = row * height;

        // Calculate the position in the world to render the tile
        let x = (dataIndex % worldSize.x) * width * scale.x;
        let y = Math.floor(dataIndex / worldSize.x) * height * scale.y;
        ctx.drawImage(this.image, left, top, width, height, x - origin.x, y - origin.y, width * scale.x, height * scale.y);
    }
}