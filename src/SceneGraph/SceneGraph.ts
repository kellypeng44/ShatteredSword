import Viewport from "./Viewport";
import CanvasNode from "../Nodes/CanvasNode";
import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";

export default abstract class SceneGraph{
	protected viewport: Viewport;
	protected nodeMap: Map<CanvasNode>;
	protected idCounter: number;

    constructor(viewport: Viewport){
		this.viewport = viewport;
		this.nodeMap = new Map<CanvasNode>();
		this.idCounter = 0;
    }

    addNode(node: CanvasNode): number {
		this.nodeMap.add(this.idCounter.toString(), node);
		this.addNodeSpecific(node, this.idCounter.toString());
		this.idCounter += 1;
		return this.idCounter - 1;
	};

	protected abstract addNodeSpecific(node: CanvasNode, id: string): void;

    removeNode(node: CanvasNode): void {
		// Find and remove node in O(n)
		// TODO: Can this be better?
		let id = this.nodeMap.keys().filter((key: string) => this.nodeMap.get(key) === node)[0];
		if(id !== undefined){
			this.nodeMap.set(id, undefined);
			this.removeNodeSpecific(node, id);
		}
	};

	protected abstract removeNodeSpecific(node: CanvasNode, id: string): void;

	getNode(id: string): CanvasNode{
		return this.nodeMap.get(id);
	};

    getNodeAt(vecOrX: Vec2 | number, y: number = null): CanvasNode{
		if(vecOrX instanceof Vec2){
			return this.getNodeAtCoords(vecOrX.x, vecOrX.y);
		} else {
			return this.getNodeAtCoords(vecOrX, y);
		}
	}
    
    protected abstract getNodeAtCoords(x: number, y: number): CanvasNode;
    
    abstract update(deltaT: number): void;

    abstract getVisibleSet(): Array<CanvasNode>;
}