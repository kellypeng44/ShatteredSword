import Vec2 from "../DataTypes/Vec2";
import Viewport from "../SceneGraph/Viewport";
import SceneGraph from "../SceneGraph/SceneGraph";
import SceneGraphArray from "../SceneGraph/SceneGraphArray";
import CanvasNode from "../Nodes/CanvasNode";
import CanvasNodeFactory from "./Factories/CanvasNodeFactory";
import Scene from "./Scene";
import Tilemap from "../Nodes/Tilemap";
import TilemapFactory from "./Factories/TilemapFactory";
import PhysicsManager from "../Physics/PhysicsManager";
import PhysicsNodeFactory from "./Factories/PhysicsNodeFactory";
import MathUtils from "../Utils/MathUtils";

export default class Layer {
    private gameState: Scene;
    private viewport: Viewport
    private parallax: Vec2;
    private sceneGraph: SceneGraph;
    private physicsManager: PhysicsManager;
    private tilemaps: Array<Tilemap>;
    private paused: boolean;
    private hidden: boolean;
    private alpha: number;
    
    // Factories
    public canvasNode: CanvasNodeFactory;
    public tilemap: TilemapFactory;
    public physics: PhysicsNodeFactory;

    constructor(viewport: Viewport, gameState: Scene){
        this.gameState = gameState;
        this.viewport = viewport;
        this.parallax = new Vec2(1, 1);
        this.sceneGraph = new SceneGraphArray(this.viewport, this);
        this.tilemaps = new Array<Tilemap>();
        this.paused = false;
        this.hidden = false;
        this.physicsManager = new PhysicsManager();

        // Factories
        this.canvasNode = new CanvasNodeFactory(this);
        this.tilemap = new TilemapFactory(this);
        this.physics = new PhysicsNodeFactory(this, this.physicsManager);
    }

    setPaused(pauseValue: boolean): void {
        this.paused = pauseValue;
    }
    
    isPaused(): boolean {
        return this.paused;
    }

    setAlpha(alpha: number): void {
        this.alpha = MathUtils.clamp(alpha, 0, 1);
    }

    setHidden(hidden: boolean): void {
        this.hidden = hidden;
    }

    isHidden(): boolean {
        return this.hidden;
    }

    disable(): void {
        this.paused = true;
        this.hidden = true;
    }

    enable(): void {
        this.paused = false;
        this.hidden = false;
    }
    
    getViewport(): Viewport {
        return this.viewport;
    }

    setParallax(x: number, y: number): void {
        this.parallax.set(x, y);
    }

    getParallax(): Vec2 {
        return this.parallax;
    }

    add(child: CanvasNode): void {
        this.sceneGraph.addNode(child);
    }

    addTilemap(tilemap: Tilemap): void {
        this.tilemaps.push(tilemap);
    }

    update(deltaT: number): void {
        if(!this.paused){
            this.viewport.update(deltaT);
            this.physicsManager.update(deltaT);
            this.sceneGraph.update(deltaT);
            this.tilemaps.forEach((tilemap: Tilemap) => tilemap.update(deltaT));
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        if(!this.hidden){
            let previousAlpha = ctx.globalAlpha;
            ctx.globalAlpha = this.alpha;

            let visibleSet = this.sceneGraph.getVisibleSet();
            let viewportOrigin = this.viewport.getPosition();
            let origin = new Vec2(viewportOrigin.x*this.parallax.x, viewportOrigin.y*this.parallax.y);
            let size = this.viewport.getSize();

            // Render tilemaps
            this.tilemaps.forEach(tilemap => {
                tilemap.render(ctx, origin, size);
            });

            // Render visible set
            visibleSet.forEach(node => node.render(ctx, origin));

            ctx.globalAlpha = previousAlpha;
        }
    }
}