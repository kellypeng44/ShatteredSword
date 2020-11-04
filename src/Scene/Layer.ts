import Scene from "./Scene";
import MathUtils from "../Utils/MathUtils";
import GameNode from "../Nodes/GameNode";


/**
 * A layer in the scene. Has its own alpha value and parallax.
 */
export default class Layer {
    /** The scene this layer belongs to */
    protected scene: Scene;

    /** The name of this layer */
    protected name: string;

    /** Whether this layer is paused or not */
    protected paused: boolean;

    /** Whether this layer is hidden from being rendered or not */
    protected hidden: boolean;

    /** The global alpha level of this layer */
    protected alpha: number;

    /** An array of the GameNodes that belong to this layer */
    protected items: Array<GameNode>;

    /** Whether or not this layer should be ysorted */
    protected ySort: boolean;

    /** The depth of this layer compared to other layers */
    protected depth: number;

    constructor(scene: Scene, name: string){
        this.scene = scene;
        this.name = name;
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

    /** Pauses this scene and hides it */
    disable(): void {
        this.paused = true;
        this.hidden = true;
    }

    /** Unpauses this layer and makes it visible */
    enable(): void {
        this.paused = false;
        this.hidden = false;
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

    getItems(): Array<GameNode> {
        return this.items;
    }
}