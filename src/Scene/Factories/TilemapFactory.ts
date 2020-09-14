import Scene from "../Scene";
import Tilemap from "../../Nodes/Tilemap";
import PhysicsManager from "../../Physics/PhysicsManager";
import ResourceManager from "../../ResourceManager/ResourceManager";

export default class TilemapFactory {
    private scene: Scene;
    private tilemaps: Array<Tilemap>;
    private physicsManager: PhysicsManager;
    private resourceManager: ResourceManager;
    
    init(scene: Scene, tilemaps: Array<Tilemap>, physicsManager: PhysicsManager): void {
        this.scene = scene;
        this.tilemaps = tilemaps;
        this.physicsManager = physicsManager;
        this.resourceManager = ResourceManager.getInstance();
    }

    /**
     * Adds a tilemap to the scene
     * @param key The key of the loaded tilemap to load
     * @param constr The constructor of the desired tilemap
     * @param args Additional arguments to send to the tilemap constructor
     */
	add = <T extends Tilemap>(key: string, constr: new (...a: any) => T, ...args: any): Array<Tilemap> => {
        // Get Tilemap Data
        let tilemapData = this.resourceManager.getTilemap(key);

        // Get the return values
        let tilemaps = new Array<Tilemap>();

        for(let layer of tilemapData.layers){
            // Create a new tilemap object for the layer
            let tilemap = new constr(tilemapData, layer);
            tilemap.setScene(this.scene);

            // Add tilemap to scene
            this.tilemaps.push(tilemap);

            // Create a new layer in the scene
            let sceneLayer = this.scene.addLayer();
            sceneLayer.addNode(tilemap);

            // Register tilemap with physics if it's collidable
            if(tilemap.isCollidable()){
                this.physicsManager.addTilemap(tilemap);
            }

            // Assign each tileset it's image
            tilemap.getTilesets().forEach(tileset => {
                let image = this.resourceManager.getImage(tileset.getImageUrl());
                tileset.setImage(image);
            });

            // Update the return value
            tilemaps.push(tilemap);
        }

        return tilemaps;
	}
}