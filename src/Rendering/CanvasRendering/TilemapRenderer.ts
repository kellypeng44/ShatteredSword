import ResourceManager from "../../ResourceManager/ResourceManager";
import Scene from "../../Scene/Scene";
import OrthogonalTilemap from "../../Nodes/Tilemaps/OrthogonalTilemap";
import Vec2 from "../../DataTypes/Vec2";
import Tileset from "../../DataTypes/Tilesets/Tileset";

export default class TilemapRenderer {
    protected resourceManager: ResourceManager;
    protected scene: Scene;
    protected ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D){
        this.resourceManager = ResourceManager.getInstance();
        this.ctx = ctx;
    }

    setScene(scene: Scene): void {
        this.scene = scene;
    }

    renderOrthogonalTilemap(tilemap: OrthogonalTilemap): void {
        let previousAlpha = this.ctx.globalAlpha;
        this.ctx.globalAlpha = tilemap.getLayer().getAlpha();
        
        let origin = this.scene.getViewTranslation(tilemap);
        let size = this.scene.getViewport().getHalfSize();
        let zoom = this.scene.getViewScale();
        let bottomRight = origin.clone().add(size.scaled(2*zoom));

        if(tilemap.visible){
            let minColRow = tilemap.getColRowAt(origin);
            let maxColRow = tilemap.getColRowAt(bottomRight);

            for(let x = minColRow.x; x <= maxColRow.x; x++){
                for(let y = minColRow.y; y <= maxColRow.y; y++){
                    // Get the tile at this position
                    let tile = tilemap.getTileAtRowCol(new Vec2(x, y));

                    // Find the tileset that owns this tile index and render
                    for(let tileset of tilemap.getTilesets()){
                        if(tileset.hasTile(tile)){
                            this.renderTile(tileset, tile, x, y, origin, tilemap.scale, zoom);
                        }
                    }
                }
            }
        }

        this.ctx.globalAlpha = previousAlpha;
    }

    protected renderTile(tileset: Tileset, tileIndex: number, tilemapRow: number, tilemapCol: number, origin: Vec2, scale: Vec2, zoom: number): void {
        let image = this.resourceManager.getImage(tileset.getImageKey());

        // Get the true index
        let index = tileIndex - tileset.getStartIndex();

        // Get the row and col of the tile in image space
        let row = Math.floor(index / tileset.getNumCols());
        let col = index % tileset.getNumCols();
        let width = tileset.getTileSize().x;
        let height = tileset.getTileSize().y;

        // Calculate the position to start a crop in the tileset image
        let left = col * width;
        let top = row * height;

        // Calculate the position in the world to render the tile
        let x = Math.floor(tilemapRow * width * scale.x);
        let y = Math.floor(tilemapCol * height * scale.y);

        // Render the tile
        this.ctx.drawImage(image,
            left, top,
            width, height,
            Math.floor((x - origin.x)*zoom), Math.floor((y - origin.y)*zoom),
            Math.ceil(width * scale.x * zoom), Math.ceil(height * scale.y * zoom));
    }
}