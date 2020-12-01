import Layer from "./Layer";
import Viewport from "../SceneGraph/Viewport";
import Vec2 from "../DataTypes/Vec2";
import SceneGraph from "../SceneGraph/SceneGraph";
import PhysicsManager from "../Physics/PhysicsManager";
import BasicPhysicsManager from "../Physics/BasicPhysicsManager";
import SceneGraphArray from "../SceneGraph/SceneGraphArray";
import FactoryManager from "./Factories/FactoryManager";
import Tilemap from "../Nodes/Tilemap";
import ResourceManager from "../ResourceManager/ResourceManager";
import GameLoop from "../Loop/GameLoop";
import SceneManager from "./SceneManager";
import Receiver from "../Events/Receiver";
import Emitter from "../Events/Emitter";
import { Renderable, Updateable } from "../DataTypes/Interfaces/Descriptors";
import NavigationManager from "../Pathfinding/NavigationManager";
import AIManager from "../AI/AIManager";
import Map from "../DataTypes/Map";
import ParallaxLayer from "./Layers/ParallaxLayer";
import UILayer from "./Layers/UILayer";
import CanvasNode from "../Nodes/CanvasNode";
import GameNode from "../Nodes/GameNode";
import ArrayUtils from "../Utils/ArrayUtils";
import RenderingManager from "../Rendering/RenderingManager";

export default class Scene implements Updateable, Renderable {
    /** The size of the game world. */
    protected worldSize: Vec2;

    /** The viewport. */
    protected viewport: Viewport;

    /** A flag that represents whether this scene is running or not. */
    protected running: boolean;

    /** The overall game loop. */
    protected game: GameLoop;

    /** The manager of this scene. */
    protected sceneManager: SceneManager;

    /** The receiver for this scene. */
    protected receiver: Receiver;

    /** The emitter for this scene. */
    protected emitter: Emitter;

    /** This list of tilemaps in this scene. */
    protected tilemaps: Array<Tilemap>;

    /** A map from layer names to the layers themselves */
    protected layers: Map<Layer>;

    /** A map from parallax layer names to the parallax layers themselves */
    protected parallaxLayers: Map<ParallaxLayer>;

    /** A map from uiLayer names to the uiLayers themselves */
    protected uiLayers: Map<UILayer>;

    /** The scene graph of the Scene*/
    protected sceneGraph: SceneGraph;

    /** The physics manager of the Scene */
    protected physicsManager: PhysicsManager;
    
    /** The navigation manager of the Scene */
    protected navManager: NavigationManager;

    /** The AI manager of the Scene */
    protected aiManager: AIManager;

    /** The renderingManager of the scene */
    protected renderingManager: RenderingManager;

    /** An interface that allows the adding of different nodes to the scene */
    public add: FactoryManager;

    /** An interface that allows the loading of different files for use in the scene */
    public load: ResourceManager;

    /** The configuration options for this scene */
    public sceneOptions: SceneOptions;

    constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, game: GameLoop, options: Record<string, any>){
        this.sceneOptions = SceneOptions.parse(options);

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

        this.layers = new Map();
        this.uiLayers = new Map();
        this.parallaxLayers = new Map();

        this.physicsManager = new BasicPhysicsManager(this.sceneOptions.physics);
        this.navManager = new NavigationManager();
        this.aiManager = new AIManager();
        this.renderingManager = renderingManager;

        this.add = new FactoryManager(this, this.tilemaps);

        this.load = ResourceManager.getInstance();
    }

    /** A lifecycle method that gets called when a new scene is created. Load all files you wish to access in the scene here. */
    loadScene(): void {}

    /** A lifecycle method that gets called on scene destruction. Specify which files you no longer need for garbage collection. */
    unloadScene(): void {}

    /** A lifecycle method called strictly after loadScene(). Create any game objects you wish to use in the scene here. */
    startScene(): void {}

    /**
     * A lifecycle method called every frame of the game. This is where you can dynamically do things like add in new enemies
     * @param delta 
     */
    updateScene(deltaT: number): void {}

    update(deltaT: number): void {
        this.updateScene(deltaT);

        // Do all AI updates
        this.aiManager.update(deltaT);

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

    render(): void {
        // Get the visible set of nodes
        let visibleSet = this.sceneGraph.getVisibleSet();

        // Add parallax layer items to the visible set (we're rendering them all for now)
        this.parallaxLayers.forEach(key => {
            let pLayer = this.parallaxLayers.get(key);
            for(let node of pLayer.getItems()){
                if(node instanceof CanvasNode){
                    visibleSet.push(node);
                }
            }
        });

        // Send the visible set, tilemaps, and uiLayers to the renderer
        this.renderingManager.render(visibleSet, this.tilemaps, this.uiLayers);
    }

    setRunning(running: boolean): void {
        this.running = running;
    }

    isRunning(): boolean {
        return this.running;
    }

    /**
     * Adds a new layer to the scene and returns it
     * @param name The name of the new layer
     * @param depth The depth of the layer
     */
    addLayer(name: string, depth?: number): Layer {
        if(this.layers.has(name) || this.parallaxLayers.has(name) || this.uiLayers.has(name)){
            throw `Layer with name ${name} already exists`;
        }

        let layer = new Layer(this, name);

        this.layers.add(name, layer);

        if(depth){
            layer.setDepth(depth);
        }

        return layer;
    }

    /**
     * Adds a new parallax layer to this scene and returns it
     * @param name The name of the parallax layer
     * @param parallax The parallax level
     * @param depth The depth of the layer
     */
    addParallaxLayer(name: string, parallax: Vec2, depth?: number): ParallaxLayer {
        if(this.layers.has(name) || this.parallaxLayers.has(name) || this.uiLayers.has(name)){
            throw `Layer with name ${name} already exists`;
        }

        let layer = new ParallaxLayer(this, name, parallax);

        this.parallaxLayers.add(name, layer);

        if(depth){
            layer.setDepth(depth);
        }

        return layer;
    }

    /**
     * Adds a new UILayer to the scene
     * @param name The name of the new UIlayer
     */
    addUILayer(name: string): UILayer {
        if(this.layers.has(name) || this.parallaxLayers.has(name) || this.uiLayers.has(name)){
            throw `Layer with name ${name} already exists`;
        }

        let layer = new UILayer(this, name);

        this.uiLayers.add(name, layer);

        return layer;
    }

    /**
     * Gets a layer from the scene by name if it exists
     * @param name The name of the layer
     */
    getLayer(name: string): Layer {
        if(this.layers.has(name)){
            return this.layers.get(name);
        } else if(this.parallaxLayers.has(name)){
            return this.parallaxLayers.get(name);
        } else if(this.uiLayers.has(name)){
            return this.uiLayers.get(name);
        } else {
            throw `Requested layer ${name} does not exist.`;
        }
    }

    /**
     * Returns true if this layer is a ParallaxLayer
     * @param name 
     */
    isParallaxLayer(name: string): boolean {
        return this.parallaxLayers.has(name);
    }

    /**
     * Returns true if this layer is a UILayer
     * @param name 
     */
    isUILayer(name: string): boolean {
        return this.uiLayers.has(name);
    }    

    /**
     * Returns the translation of this node with respect to camera space (due to the viewport moving);
     * @param node 
     */
    getViewTranslation(node: GameNode): Vec2 {
        let layer = node.getLayer();

        if(layer instanceof ParallaxLayer || layer instanceof UILayer){
            return this.viewport.getOrigin().mult(layer.parallax);
        } else {
            return this.viewport.getOrigin();
        }
	}

    /** Returns the scale level of the view */
	getViewScale(): number {
		return this.viewport.getZoomLevel();
	}

    /** Returns the viewport associated with this scene */
    getViewport(): Viewport {
        return this.viewport;
    }

    getWorldSize(): Vec2 {
        return this.worldSize;
    }

    getSceneGraph(): SceneGraph {
        return this.sceneGraph;
    }

    getPhysicsManager(): PhysicsManager {
        return this.physicsManager;
    }

    getNavigationManager(): NavigationManager {
        return this.navManager;
    }

    getAIManager(): AIManager {
        return this.aiManager;
    }

    generateId(): number {
        return this.sceneManager.generateId();
    }

    getTilemap(name: string): Tilemap {
        for(let tilemap of this .tilemaps){
            if(tilemap.name === name){
                return tilemap;
            }
        }

        return null;
    }
}

class SceneOptions {
    physics: {
        numPhysicsLayers: number,
        physicsLayerNames: Array<string>,
        physicsLayerCollisions: Array<Array<number>>;
    }

    static parse(options: Record<string, any>): SceneOptions{
        let sOpt = new SceneOptions();

        sOpt.physics = {
            numPhysicsLayers: 10,
            physicsLayerNames: null,
            physicsLayerCollisions: ArrayUtils.ones2d(10, 10)
        };

        if(options.physics){
            if(options.physics.numPhysicsLayers)        sOpt.physics.numPhysicsLayers = options.physics.numPhysicsLayers;
            if(options.physics.physicsLayerNames)       sOpt.physics.physicsLayerNames = options.physics.physicsLayerNames;
            if(options.physics.physicsLayerCollisions)  sOpt.physics.physicsLayerCollisions = options.physics.physicsLayerCollisions;
        }

        return sOpt;
    }
}