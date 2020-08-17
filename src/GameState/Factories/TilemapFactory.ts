import Scene from "../Scene";
import Viewport from "../../SceneGraph/Viewport";
import Tilemap from "../../Nodes/Tilemap"
import ResourceManager from "../../ResourceManager/ResourceManager";
import { TiledTilemapData } from "../../DataTypes/Tilesets/TiledData";
import StringUtils from "../../Utils/StringUtils";

export default class TilemapFactory {
    private scene: Scene;
    private viewport: Viewport;
    private resourceManager: ResourceManager;

	constructor(scene: Scene, viewport: Viewport){
        this.scene = scene;
        this.resourceManager = ResourceManager.getInstance();
	}

	add<T extends Tilemap>(constr: new (...a: any) => T, path: string, ...args: any): void {
        this.resourceManager.loadTilemap(path, (tilemapData: TiledTilemapData) => {
            // For each of the layers in the tilemap, create a tilemap
            for(let layer of tilemapData.layers){
                let tilemap = new constr(tilemapData, layer);

                // Add to scene
                this.scene.addTilemap(tilemap);

                // Load images for the tilesets
                tilemap.getTilesets().forEach(tileset => {
                    let imagePath = StringUtils.getPathFromFilePath(path) + tileset.getImageUrl();
                    this.resourceManager.loadImage(imagePath, (path: string, image: HTMLImageElement) => {
                        tileset.setImage(image);
                    })
                });
            }
        });
	}
}