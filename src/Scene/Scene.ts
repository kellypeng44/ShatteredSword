import Stack from "../DataTypes/Stack";
import Layer from "./Layer";
import Viewport from "../SceneGraph/Viewport";
import Vec2 from "../DataTypes/Vec2";
import SceneGraph from "../SceneGraph/SceneGraph";
import PhysicsManager from "../Physics/PhysicsManager";
import SceneGraphArray from "../SceneGraph/SceneGraphArray";
import FactoryManager from "./Factories/FactoryManager";
import Tilemap from "../Nodes/Tilemap";
import ResourceManager from "../ResourceManager/ResourceManager";
import GameLoop from "../Loop/GameLoop";
import SceneManager from "./SceneManager";
import Receiver from "../Events/Receiver";
import Emitter from "../Events/Emitter";

export default class Scene{
    protected worldSize: Vec2;
    protected viewport: Viewport;
    protected running: boolean;
    protected game: GameLoop;
    protected sceneManager: SceneManager;
    protected receiver: Receiver;
    protected emitter: Emitter;

    protected tilemaps: Array<Tilemap>;

    /**
     * The scene graph of the Scene - can be exchanged with other SceneGraphs for more variation
     */
    protected sceneGraph: SceneGraph;
    protected physicsManager: PhysicsManager;
    
    /**
    * An interface that allows the adding of different nodes to the scene
    */
    public add: FactoryManager;

    /**
     * An interface that allows the loading of different files for use in the scene
     */
    public load: ResourceManager;

    constructor(viewport: Viewport, sceneManager: SceneManager, game: GameLoop){
        this.worldSize = new Vec2(500, 500);
        this.viewport = viewport;
        this.viewport.setBounds(0, 0, 2560, 1280);
        this.running = false;
        this.game = game;
        this.sceneManager = sceneManager;
        this.receiver = new Receiver();
        this.emitter = new Emitter();

        this.tilemaps = new Array();
        this.sceneGraph = new SceneGraphArray(this.viewport, this);
        this.physicsManager = new PhysicsManager();


        this.add = new FactoryManager(this, this.physicsManager, this.tilemaps);


        this.load = ResourceManager.getInstance();
    }

    /**
     * A function that gets called when a new scene is created. Load all files you wish to access in the scene here.
     */
    loadScene(): void {}

    /**
     * A function that gets called on scene destruction. Specify which files you no longer need for garbage collection.
     */
    unloadScene(): void {}

    /**
     * Called strictly after loadScene() is called. Create any game objects you wish to use in the scene here.
     */
    startScene(): void {}

    /**
     * Called every frame of the game. This is where you can dynamically do things like add in new enemies
     * @param delta 
     */
    updateScene(deltaT: number): void {}

    /**
     * Updates all scene elements
     * @param deltaT 
     */
    update(deltaT: number): void {
        this.updateScene(deltaT);

        // Update all physics objects
        this.physicsManager.update(deltaT);

        // Update all canvas objects
        this.sceneGraph.update(deltaT);

        // Update all tilemaps
        this.tilemaps.forEach(tilemap => {
            if(!tilemap.getLayer().isPaused()){
                tilemap.update(deltaT);
            } 
        });

        // Update viewport
        this.viewport.update(deltaT);
    }

    /**
     * Render all CanvasNodes and Tilemaps in the Scene
     * @param ctx 
     */
    render(ctx: CanvasRenderingContext2D): void {
        // For webGL, pass a visible set to the renderer
        // We need to keep track of the order of things.
        let visibleSet = this.sceneGraph.getVisibleSet();

        // Render scene graph for demo
        this.sceneGraph.render(ctx);

        // Render tilemaps
        this.tilemaps.forEach(tilemap => {
            tilemap.render(ctx);
        });

        // Render visible set
        visibleSet.forEach(node => node.render(ctx));
    }

    setRunning(running: boolean): void {
        this.running = running;
    }

    isRunning(): boolean {
        return this.running;
    }

    /**
     * Adds a new layer to the scene and returns it
     */
    addLayer(): Layer {
        return this.sceneGraph.addLayer();
    }

    /**
     * Returns the viewport associated with this scene
     */
    getViewport(): Viewport {
        return this.viewport;
    }

    getWorldSize(): Vec2 {
        return this.worldSize;
    }

    getSceneGraph(): SceneGraph {
        return this.sceneGraph;
    }

    generateId(): number {
        return this.sceneManager.generateId();
    }
}