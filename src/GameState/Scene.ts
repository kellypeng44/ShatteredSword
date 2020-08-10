import Vec2 from "../DataTypes/Vec2";
import Viewport from "../SceneGraph/Viewport";
import SceneGraph from "../SceneGraph/SceneGraph";
import SceneGraphArray from "../SceneGraph/SceneGraphArray";
import CanvasNode from "../Nodes/CanvasNode";
import CavnasNodeFactory from "./Factories/CanvasNodeFactory";
import CanvasNodeFactory from "./Factories/CanvasNodeFactory";
import GameState from "./GameState";

export default class Scene {
    private gameState: GameState;
    private viewport: Viewport
    private parallax: Vec2;
	sceneGraph: SceneGraph;
    private paused: boolean;
    private hidden: boolean;
    
    // Factories
    public canvas: CavnasNodeFactory;

    constructor(viewport: Viewport, gameState: GameState){
        this.gameState = gameState;
        this.viewport = viewport;
        this.parallax = new Vec2(1, 1);
        this.sceneGraph = new SceneGraphArray(this.viewport, this);
        this.paused = false;
        this.hidden = false;

        this.canvas = new CanvasNodeFactory(this, this.viewport);
    }

    setPaused(pauseValue: boolean): void {
        this.paused = pauseValue;
    }

    isPaused(): boolean {
        return this.paused;
    }

    setHidden(hiddenValue: boolean): void {
        this.hidden = hiddenValue;
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

    add(children: CanvasNode): void {
        this.sceneGraph.addNode(children);
    }

    update(deltaT: number): void {
        if(!this.paused){
            this.viewport.update(deltaT);
            this.sceneGraph.update(deltaT);
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        if(!this.hidden){
            let visibleSet = this.sceneGraph.getVisibleSet();
            let viewportOrigin = this.viewport.getPosition();
            let origin = new Vec2(viewportOrigin.x*this.parallax.x, viewportOrigin.y*this.parallax.y);
            visibleSet.forEach(node => node.render(ctx, origin));
        }
    }
}