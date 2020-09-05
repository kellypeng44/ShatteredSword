import Stack from "../DataTypes/Stack";
import Layer from "./Layer";
import Viewport from "../SceneGraph/Viewport";
import Vec2 from "../DataTypes/Vec2";

export default class Scene{
    private layers: Stack<Layer>;
    private worldSize: Vec2;
    private viewport: Viewport;
    private running: boolean;

    constructor(viewport: Viewport){
        this.layers = new Stack(10);
        this.worldSize = new Vec2(1600, 1000);
        this.viewport = viewport;
        this.viewport.setBounds(0, 0, 2560, 1280);
        this.running = false;
    }

    loadScene(): void {}

    unloadScene(): void {}

    setRunning(running: boolean): void {
        this.running = running;
    }

    isRunning(): boolean {
        return this.isRunning();
    }

    start(){}

    update(deltaT: number): void {
        this.layers.forEach((scene: Layer) => scene.update(deltaT));
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.layers.forEach((scene: Layer) => scene.render(ctx));
    }
}