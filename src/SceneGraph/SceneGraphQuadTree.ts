import SceneGraph from "./SceneGraph";
import CanvasNode from "../Nodes/CanvasNode";
import Viewport from "./Viewport";
import Scene from "../Scene/Scene";
import RegionQuadTree from "../DataTypes/RegionQuadTree";
import Vec2 from "../DataTypes/Vec2";
import AABB from "../DataTypes/AABB";
import Stats from "../Debug/Stats";

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
        let t0 = performance.now();
        let res = this.qt.queryRegion(boundary);
        let t1 = performance.now();

        Stats.log("sgquery", (t1-t0));

        return res;
    }

    update(deltaT: number): void {
        let t0 = performance.now();
        this.qt.clear();
        let t1 = performance.now();

        Stats.log("sgclear", (t1-t0));

        t0 = performance.now();
        for(let node of this.nodes){
            this.qt.insert(node);
        }
        t1 = performance.now();

        Stats.log("sgfill", (t1-t0));

        t0 = performance.now();
        this.nodes.forEach((node: CanvasNode) => node.update(deltaT));
        t1 = performance.now();

        Stats.log("sgupdate", (t1-t0));
    }

    render(ctx: CanvasRenderingContext2D): void {
        let origin = this.viewport.getOrigin();
        let zoom = this.viewport.getZoomLevel();
        this.qt.render_demo(ctx, origin, zoom);
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