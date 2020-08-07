import SceneGraph from "./SceneGraph";
import GameNode from "../Nodes/GameNode";
import Viewport from "./Viewport";

export default class SceneGraphArray extends SceneGraph{
	private nodeList: Array<GameNode>;
	private turnOffViewportCulling_demoTool: boolean;

    constructor(viewport: Viewport){
        super(viewport);

        this.nodeList = new Array<GameNode>();
        this.turnOffViewportCulling_demoTool = false;
    }

    setViewportCulling_demoTool(bool: boolean): void {
        this.turnOffViewportCulling_demoTool = bool;
    }

    addNodeSpecific(node: GameNode, id: string): void {
        this.nodeList.push(node);
    }

    removeNodeSpecific(node: GameNode, id: string): void {
        let index = this.nodeList.indexOf(node);
        if(index > -1){
            this.nodeList.splice(index, 1);
        }
    }

    getNodeAtCoords(x: number, y: number): GameNode {
        // TODO: This only returns the first node found. There is no notion of z coordinates
        for(let node of this.nodeList){
            if(node.contains(x, y)){
                return node;
            }
        }
        return null;
    }

    update(deltaT: number): void {
        for(let node of this.nodeList){
            node.update(deltaT);
        }
    }

    getVisibleSet(): Array<GameNode> {
        // If viewport culling is turned off for demonstration
        if(this.turnOffViewportCulling_demoTool){
            let visibleSet = new Array<GameNode>();
            for(let node of this.nodeList){
                visibleSet.push(node);
            }
            return visibleSet;
        }

        let visibleSet = new Array<GameNode>();

        for(let node of this.nodeList){
            if(this.viewport.includes(node)){
                visibleSet.push(node);
            }
        }

        return visibleSet;
    }
}