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

export default class Scene{
    protected layers: Stack<Layer>;
    protected worldSize: Vec2;
    protected viewport: Viewport;
    protected running: boolean;
    protected game: GameLoop;

    protected tilemaps: Array<Tilemap>;
    protected sceneGraph: SceneGraph;
    protected physicsManager: PhysicsManager;
    
    public add: FactoryManager;
    public load: ResourceManager;

    constructor(viewport: Viewport, game: GameLoop){
        this.layers = new Stack(10);
        this.worldSize = new Vec2(1600, 1000);
        this.viewport = viewport;
        this.viewport.setBounds(0, 0, 2560, 1280);
        this.running = false;
        this.game = game;

        this.tilemaps = new Array();
        this.sceneGraph = new SceneGraphArray(this.viewport, this);
        this.physicsManager = new PhysicsManager();

        // Factories for this scene
        this.add = new FactoryManager(this, this.sceneGraph, this.physicsManager, this.tilemaps);
        this.load = ResourceManager.getInstance();
    }

    loadScene(): void {}

    unloadScene(): void {}

    startScene(): void {}

    updateScene(delta: number): void {}

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

    render(ctx: CanvasRenderingContext2D): void {
        // For webGL, pass a visible set to the renderer
        // We need to keep track of the order of things.
        let visibleSet = this.sceneGraph.getVisibleSet();

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

    addLayer(): Layer {
        let layer = new Layer(this);
        this.layers.push(layer);
        return layer;
    }

    getViewport(): Viewport {
        return this.viewport;
    }
}