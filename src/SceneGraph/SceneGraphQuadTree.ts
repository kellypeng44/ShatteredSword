import SceneGraph from "./SceneGraph";
import CanvasNode from "../Nodes/CanvasNode";
import Viewport from "./Viewport";
import Scene from "../Scene/Scene";
import RegionQuadTree from "../DataTypes/RegionQuadTree";
import Vec2 from "../DataTypes/Vec2";
import AABB from "../DataTypes/AABB";

export default class SceneGraphQuadTree extends SceneGraph {
    private qt: RegionQuadTree<CanvasNode>;
    private nodes: Array<CanvasNode>;

    constructor(viewport: Viewport, scene: Scene){
        super(viewport, scene);

        let size = this.scene.getWorldSize();
        this.qt = new RegionQuadTree(size.clone().scale(1/2), size.clone().scale(1/2), 5, 30);
        this.nodes = new Array();
    }

    addNodeSpecific(node: CanvasNode, id: string): void {
        this.nodes.push(node);
    }

    removeNodeSpecific(node: CanvasNode, id: string): void {
        let index = this.nodes.indexOf(node);
        if(index >= 0){
            this.nodes.splice(index, 1);
        }
    }

    getNodesAtCoords(x: number, y: number): Array<CanvasNode> {
        return this.qt.queryPoint(new Vec2(x, y));
    }

    getNodesInRegion(boundary: AABB): Array<CanvasNode> {
        return this.qt.queryRegion(boundary);
    }

    update(deltaT: number): void {
        this.qt.clear();

        for(let node of this.nodes){
            this.qt.insert(node);
        }

        this.nodes.forEach((node: CanvasNode) => node.update(deltaT));
        // TODO: forEach is buggy, some nodes are update multiple times
        // this.qt.forEach((node: CanvasNode) => {
        //     if(!node.getLayer().isPaused()){
        //         node.update(deltaT);
        //     }
        // });
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.qt.render_demo(ctx);
    }

    getVisibleSet(): Array<CanvasNode> {
        let visibleSet = this.qt.queryRegion(this.viewport.getView());

        visibleSet = visibleSet.filter(node => !node.getLayer().isHidden());

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