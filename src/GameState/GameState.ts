import Stack from "../DataTypes/Stack";
import Scene from "./Scene";
import Viewport from "../SceneGraph/Viewport";
import Vec2 from "../DataTypes/Vec2";

export default class GameState{
    private sceneStack: Stack<Scene>;
    private worldSize: Vec2;
    private viewport: Viewport;

    constructor(){
        this.sceneStack = new Stack(10);
        this.worldSize = new Vec2(1600, 1000);
        this.viewport = new Viewport();
        this.viewport.setSize(800, 500);
        this.viewport.setBounds(0, 0, 2560, 1280);
    }

    createScene(): Scene{
        let scene = new Scene(this.viewport, this);
        this.addScene(scene);
        return scene;
    }

    addScene(scene: Scene): void {
        this.sceneStack.push(scene);
    }

    removeScene(startNewTopScene: boolean = true): void {
        this.sceneStack.pop();
        this.sceneStack.peek().setPaused(!startNewTopScene);
    }

    changeScene(scene: Scene): void {
        this.sceneStack.clear();
        this.sceneStack.push(scene);
    }

    update(deltaT: number): void {
        this.sceneStack.forEach((scene: Scene) => scene.update(deltaT));
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.sceneStack.forEach((scene: Scene) => scene.render(ctx));
    }
}