import Viewport from "./Viewport";
import CanvasNode from "../Nodes/CanvasNode";
import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";
import Scene from "../Scene/Scene";
import AABB from "../DataTypes/Shapes/AABB";

/**
 * An abstract interface of a SceneGraph. Exposes methods for use by other code, but leaves the implementation up to the subclasses.
 */
export default abstract class SceneGraph {
	protected viewport: Viewport;
	protected nodeMap: Map<CanvasNode>;
	protected idCounter: number;
	protected scene: Scene;

    constructor(viewport: Viewport, scene: Scene){
		this.viewport = viewport;
		this.scene = scene;
		this.nodeMap = new Map<CanvasNode>();
		this.idCounter = 0;
    }

	/**
	 * Add a node to the SceneGraph
	 * @param node The CanvasNode to add to the SceneGraph
	 */
    addNode(node: CanvasNode): number {
		this.nodeMap.add(this.idCounter.toString(), node);
		this.addNodeSpecific(node, this.idCounter.toString());
		this.idCounter += 1;
		return this.idCounter - 1;
	};

	/**
	 * An overridable method to add a CanvasNode to the specific data structure of the SceneGraph
	 * @param node The node to add to the data structure
	 * @param id The id of the CanvasNode
	 */
	protected abstract addNodeSpecific(node: CanvasNode, id: string): void;

	/**
	 * Removes a node from the SceneGraph
	 * @param node The node to remove
	 */
    removeNode(node: CanvasNode): void {
		// Find and remove node in O(n)
		// TODO: Can this be better?
		let id = this.nodeMap.keys().filter((key: string) => this.nodeMap.get(key) === node)[0];
		if(id !== undefined){
			this.nodeMap.set(id, undefined);
			this.removeNodeSpecific(node, id);
		}
	};

	/**
	 * The specific implementation of removing a node
	 * @param node The node to remove
	 * @param id The id of the node to remove
	 */
	protected abstract removeNodeSpecific(node: CanvasNode, id: string): void;

	/**
	 * Get a specific node using its id
	 * @param id The id of the CanvasNode to retrieve
	 */
	getNode(id: string): CanvasNode {
		return this.nodeMap.get(id);
	}

	/**
	 * Returns the node at specific coordinates
	 * @param vecOrX 
	 * @param y 
	 */
    getNodesAt(vecOrX: Vec2 | number, y: number = null): Array<CanvasNode> {
		if(vecOrX instanceof Vec2){
			return this.getNodesAtCoords(vecOrX.x, vecOrX.y);
		} else {
			return this.getNodesAtCoords(vecOrX, y);
		}
	}

	abstract getNodesInRegion(boundary: AABB): Array<CanvasNode>;
	
	getAllNodes(): Array<CanvasNode> {
		let arr = new Array<CanvasNode>();
		this.nodeMap.forEach(key => arr.push(this.nodeMap.get(key)));
		return arr;
	}

	/**
	 * The specific implementation of getting a node at certain coordinates
	 * @param x 
	 * @param y 
	 */
    protected abstract getNodesAtCoords(x: number, y: number): Array<CanvasNode>;

	abstract update(deltaT: number): void;
	
	abstract render(ctx: CanvasRenderingContext2D): void;

	/**
	 * Gets the visible set of CanvasNodes based on the viewport
	 */
    abstract getVisibleSet(): Array<CanvasNode>;
}