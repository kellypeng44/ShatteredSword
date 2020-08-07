import Vec2 from "../DataTypes/Vec2";
import Viewport from "../SceneGraph/Viewport";
import SceneGraph from "../SceneGraph/SceneGraph";
import SceneGraphArray from "../SceneGraph/SceneGraphArray";
import GameNode from "../Nodes/GameNode";

export default class Scene{
	private viewport: Viewport
	private worldSize: Vec2;
	private sceneGraph: SceneGraph;
	private paused: boolean;

    constructor(){
        this.viewport = new Viewport();
        this.viewport.setSize(800, 500);
        // TODO: Find a way to make this not a hard-coded value
        this.worldSize = new Vec2(1600, 1000);
        this.viewport.setBounds(0, 0, 1600, 1000);
        this.sceneGraph = new SceneGraphArray(this.viewport);
        this.paused = false;
    }

    setPaused(pauseValue: boolean): void {
        this.paused = pauseValue;
    }

    isPaused(): boolean {
        return this.paused;
    }
    
    getViewport(): Viewport {
        return this.viewport;
    }

    add(children: Array<GameNode> | GameNode): void {
        if(children instanceof Array){
            for(let child of children){
                this.sceneGraph.addNode(child);
            }
        } else {
            this.sceneGraph.addNode(children);
        }
    }

    update(deltaT: number): void {
        if(!this.paused){
            this.viewport.update(deltaT);
            this.sceneGraph.update(deltaT);
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        let visibleSet = this.sceneGraph.getVisibleSet();
        visibleSet.forEach(node => node.render(ctx, this.viewport.getPosition(), this.viewport.getSize()));
    }
}