import Scene from "../Scene";
import CanvasNodeFactory from "./CanvasNodeFactory";
import TilemapFactory from "./TilemapFactory";
import PhysicsManager from "../../Physics/PhysicsManager";
import Tilemap from "../../Nodes/Tilemap";

export default class FactoryManager {

    // Constructors are called here to allow assignment of their functions to functions in this class
    private canvasNodeFactory: CanvasNodeFactory = new CanvasNodeFactory();
    private tilemapFactory: TilemapFactory = new TilemapFactory();

    constructor(scene: Scene, physicsManager: PhysicsManager, tilemaps: Array<Tilemap>){
        this.canvasNodeFactory.init(scene);
        this.tilemapFactory.init(scene, tilemaps, physicsManager);
    }

    // Expose all of the factories through the factory manager
    uiElement = this.canvasNodeFactory.addUIElement;
    sprite = this.canvasNodeFactory.addSprite;
    graphic = this.canvasNodeFactory.addGraphic;
    tilemap = this.tilemapFactory.add;
}