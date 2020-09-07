import Scene from "../Scene";
import PhysicsNodeFactory from "./PhysicsNodeFactory";
import CanvasNodeFactory from "./CanvasNodeFactory";
import TilemapFactory from "./TilemapFactory";
import AudioFactory from "./AudioFactory";
import PhysicsManager from "../../Physics/PhysicsManager";
import SceneGraph from "../../SceneGraph/SceneGraph";
import Tilemap from "../../Nodes/Tilemap";

export default class FactoryManager {

    private canvasNodeFactory: CanvasNodeFactory = new CanvasNodeFactory();
    private physicsNodeFactory: PhysicsNodeFactory = new PhysicsNodeFactory();
    private tilemapFactory: TilemapFactory = new TilemapFactory();
    private audioFactory: AudioFactory = new AudioFactory();

    constructor(scene: Scene, sceneGraph: SceneGraph, physicsManager: PhysicsManager, tilemaps: Array<Tilemap>){
        this.canvasNodeFactory.init(scene, sceneGraph);
        this.physicsNodeFactory.init(scene, physicsManager);
        this.tilemapFactory.init(scene, tilemaps, physicsManager);
        this.audioFactory.init(scene);
    }

    uiElement = this.canvasNodeFactory.addUIElement;
    sprite = this.canvasNodeFactory.addSprite;
    graphic = this.canvasNodeFactory.addGraphic;
    physics = this.physicsNodeFactory.add;
    tilemap = this.tilemapFactory.add;
    audio = this.audioFactory.addAudio;
}