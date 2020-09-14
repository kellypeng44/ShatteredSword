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

    constructor(scene: Scene){
        this.scene = scene;
        this.parallax = new Vec2(1, 1);
        this.paused = false;
        this.hidden = false;
        this.alpha = 1;
        this.items = new Array();
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

    addNode(node: GameNode): void {
        this.items.push(node);
        node.setLayer(this);
    }
}