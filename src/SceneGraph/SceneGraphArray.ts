import SceneGraph from "./SceneGraph";
import CanvasNode from "../Nodes/CanvasNode";
import Viewport from "./Viewport";
import Scene from "../Scene/Scene";
import Stack from "../DataTypes/Stack";
import Layer from "../Scene/Layer"
import AABB from "../DataTypes/AABB";
import Stats from "../Debug/Stats";

export default class SceneGraphArray extends SceneGraph{
	private nodeList: Array<CanvasNode>;
    private turnOffViewportCulling_demoTool: boolean;

    constructor(viewport: Viewport, scene: Scene){
        super(viewport, scene);

        this.nodeList = new Array<CanvasNode>();
        this.turnOffViewportCulling_demoTool = false;
    }

    setViewportCulling_demoTool(bool: boolean): void {
        this.turnOffViewportCulling_demoTool = bool;
    }

    addNodeSpecific(node: CanvasNode, id: string): void {
        this.nodeList.push(node);
    }

    removeNodeSpecific(node: CanvasNode, id: string): void {
        let index = this.nodeList.indexOf(node);
        if(index > -1){
            this.nodeList.splice(index, 1);
        }
    }

    getNodesAtCoords(x: number, y: number): Array<CanvasNode> {
        let results = [];

        for(let node of this.nodeList){
            if(node.contains(x, y)){
                results.push(node);
            }
        }

        return results;
    }

    getNodesInRegion(boundary: AABB): Array<CanvasNode> {
        let t0 = performance.now();
        let results = [];

        for(let node of this.nodeList){
            if(boundary.overlaps(node.getBoundary())){
                results.push(node);
            }
        }
        let t1 = performance.now();
        Stats.log("sgquery", (t1-t0));

        return results;
    }

    update(deltaT: number): void {
        let t0 = performance.now();
        for(let node of this.nodeList){
            if(!node.getLayer().isPaused()){
                node.update(deltaT);
            }
        }
        let t1 = performance.now();
        Stats.log("sgupdate", (t1-t0));
    }

    render(ctx: CanvasRenderingContext2D): void {}

    getVisibleSet(): Array<CanvasNode> {
        // If viewport culling is turned off for demonstration
        if(this.turnOffViewportCulling_demoTool){
            let visibleSet = new Array<CanvasNode>();
            for(let node of this.nodeList){
                visibleSet.push(node);
            }
            return visibleSet;
        }

        let visibleSet = new Array<CanvasNode>();

        for(let node of this.nodeList){
            if(!node.getLayer().isHidden() && this.viewport.includes(node)){
                visibleSet.push(node);
            }
        }

        // Sort by depth, then by visible set by y-value
        visibleSet.sort((a, b) => {
            if(a.getLayer().getDepth() === b.getLayer().getDepth()){
                return (a.getPosition().y + a.getSize().y*a.getScale().y)
                - (b.getPosition().y + b.getSize().y*b.getScale().y);
            } else {
                return a.getLayer().getDepth() - b.getLayer().getDepth();
            }
        });

        return visibleSet;
    }
}