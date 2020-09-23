import Vec2 from "../DataTypes/Vec2";
import Scene from "./Scene";
import MathUtils from "../Utils/MathUtils";
import GameNode from "../Nodes/GameNode";

/**
 * A layer in the scene. Has its own alpha value and parallax.
 */
export default class Layer {
    protected scene: Scene;
    protected parallax: Vec2;
    protected paused: boolean;
    protected hidden: boolean;
    protected alpha: number;
    protected items: Array<GameNode>;
    protected ySort: boolean;
    protected depth: number;

    constructor(scene: Scene){
        this.scene = scene;
        this.parallax = new Vec2(1, 1);
        this.paused = false;
        this.hidden = false;
        this.alpha = 1;
        this.items = new Array();
        this.ySort = false;
        this.depth = 0;
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

    getAlpha(): number {
        return this.alpha;
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

    setParallax(x: number, y: number): void {
        this.parallax.set(x, y);
    }

    getParallax(): Vec2 {
        return this.parallax;
    }

    setYSort(ySort: boolean): void {
        this.ySort = ySort;
    }

    getYSort(): boolean {
        return this.ySort;
    }

    setDepth(depth: number): void {
        this.depth = depth;
    }

    getDepth(): number {
        return this.depth;
    }

    addNode(node: GameNode): void {
        this.items.push(node);
        node.setLayer(this);
    }
}