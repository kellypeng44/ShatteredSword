import Stack from "../DataTypes/Stack";
import Scene from "./Scene";

export default class GameState{
	private sceneStack: Stack<Scene>;

    constructor(){
        this.sceneStack = new Stack(10);
    }

    addScene(scene: Scene, pauseScenesBelow: boolean = true): void {
        this.sceneStack.forEach((scene: Scene) => scene.setPaused(pauseScenesBelow));
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