import Layer from "../Layer";
import Viewport from "../../SceneGraph/Viewport";
import Tilemap from "../../Nodes/Tilemap";
import ResourceManager from "../../ResourceManager/ResourceManager";
import { TiledTilemapData } from "../../DataTypes/Tilesets/TiledData";
import StringUtils from "../../Utils/StringUtils";
import StaticBody from "../../Physics/StaticBody";
import Vec2 from "../../DataTypes/Vec2";

export default class TilemapFactory {
    private scene: Layer;
    // TODO: get the resource manager OUT of here, it does not belong
    private resourceManager: ResourceManager;

	constructor(scene: Layer){
        this.scene = scene;
        this.resourceManager = ResourceManager.getInstance();
	}

	add<T extends Tilemap>(constr: new (...a: any) => T, path: string, ...args: any): void {
        // this.resourceManager.loadTilemap(path, (tilemapData: TiledTilemapData) => {
        //     // For each of the layers in the tilemap, create a tilemap
        //     for(let layer of tilemapData.layers){
        //         let tilemap = new constr(tilemapData, layer);
        //         tilemap.init(this.scene);

        //         // Add to scene
        //         this.scene.addTilemap(tilemap);

        //         if(tilemap.isCollidable()){
        //             // Register in physics as a tilemap
        //             this.scene.physics.addTilemap(tilemap);
        //         }

        //         // Load images for the tilesets
        //         tilemap.getTilesets().forEach(tileset => {
        //             let imagePath = StringUtils.getPathFromFilePath(path) + tileset.getImageUrl();
        //             this.resourceManager.loadImage(imagePath, (path: string, image: HTMLImageElement) => {
        //                 tileset.setImage(image);
        //             })
        //         });
        //     }
        // });
	}
}