import Scene from "../Scene";
import Tilemap from "../../Nodes/Tilemap";
import PhysicsManager from "../../Physics/PhysicsManager";
import ResourceManager from "../../ResourceManager/ResourceManager";
import OrthogonalTilemap from "../../Nodes/Tilemaps/OrthogonalTilemap";
import Layer from "../Layer";
import Tileset from "../../DataTypes/Tilesets/Tileset";
import Vec2 from "../../DataTypes/Vec2";
import { TiledCollectionTile } from "../../DataTypes/Tilesets/TiledData";
import Sprite from "../../Nodes/Sprites/Sprite";
import StaticBody from "../../Physics/StaticBody";

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
	add = (key: string): Array<Layer> => {
        // Get Tilemap Data
        let tilemapData = this.resourceManager.getTilemap(key);

        // Set the constructor for this tilemap to either be orthographic or isometric
        let constr: new(...args: any) => Tilemap;
        if(tilemapData.orientation === "orthographic"){
            constr = OrthogonalTilemap;
        } else {
            // No isometric tilemap support right now, so Orthographic tilemap
            constr = OrthogonalTilemap;
        }

        // Initialize the return value array
        let sceneLayers = new Array<Layer>();

        // Create all of the tilesets for this tilemap
        let tilesets = new Array<Tileset>();

        let collectionTiles = new Array<TiledCollectionTile>();

        for(let tileset of tilemapData.tilesets){
            if(tileset.image){
                // If this is a standard tileset and not a collection, create a tileset for it.
                // TODO - We are ignoring collection tilesets for now. This is likely not a great idea in practice,
                // as theoretically someone could want to use one for a standard tilemap. We are assuming for now
                // that we only want to use them for object layers
                tilesets.push(new Tileset(tileset));
            } else {
                tileset.tiles.forEach(tile => tile.id += tileset.firstgid);
                collectionTiles.push(...tileset.tiles);
            }
        }

        // Loop over the layers of the tilemap and create tiledlayers or object layers
        for(let layer of tilemapData.layers){
            
            let sceneLayer = this.scene.addLayer();
            
            if(layer.type === "tilelayer"){
                // Create a new tilemap object for the layer
                let tilemap = new constr(tilemapData, layer, tilesets);
                tilemap.setScene(this.scene);
    
                // Add tilemap to scene
                this.tilemaps.push(tilemap);
    
                sceneLayer.addNode(tilemap);
    
                // Register tilemap with physics if it's collidable
                if(tilemap.isCollidable()){
                    this.physicsManager.addTilemap(tilemap);
                }
            } else {
                // Layer is an object layer, so add each object as a sprite to a new layer
                for(let obj of layer.objects){
                    // Check if obj is collidable
                    let collidable = false;

                    if(obj.properties){
                        for(let prop of obj.properties){
                            if(prop.name === "Collidable"){
                                collidable = prop.value;
                            }
                        }
                    }

                    let sprite: Sprite;

                    // Check if obj is a tile from a tileset
                    for(let tileset of tilesets){
                        if(tileset.hasTile(obj.gid)){
                            // The object is a tile from this set
                            let imageKey = tileset.getImageKey();
                            let offset = tileset.getImageOffsetForTile(obj.gid);
                            sprite = this.scene.add.sprite(imageKey, sceneLayer);
                            let size = tileset.getTileSize().clone();
                            sprite.setPosition(obj.x*4, (obj.y - size.y)*4);
                            sprite.setImageOffset(offset);
                            sprite.setSize(size);
                            sprite.setScale(new Vec2(4, 4));
                        }
                    }

                    // Not in a tileset, must correspond to a collection
                    if(!sprite){
                        for(let tile of collectionTiles){
                            if(obj.gid === tile.id){
                                let imageKey = tile.image;
                                sprite = this.scene.add.sprite(imageKey, sceneLayer);
                                sprite.setPosition(obj.x*4, (obj.y - tile.imageheight)*4);
                                sprite.setScale(new Vec2(4, 4));
                            }
                        }
                    }

                    // Now we have sprite. Associate it with our physics object if there is one
                    if(collidable){
                        let pos = sprite.getPosition().clone();
                        pos.x = Math.floor(pos.x);
                        pos.y = Math.floor(pos.y);
                        let size = sprite.getSize().clone().mult(sprite.getScale());
                        let staticBody = this.scene.add.physics(StaticBody, sceneLayer, pos, size);
                        staticBody.addChild(sprite);
                    }

                }
            }

            // Update the return value
            sceneLayers.push(sceneLayer);
        }

        return sceneLayers;
	}
}