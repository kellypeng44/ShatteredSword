import Viewport from "./Viewport";
import CanvasNode from "../Nodes/CanvasNode";
import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";
import Scene from "../Scene/Scene";
import Layer from "../Scene/Layer";
import Stack from "../DataTypes/Stack";

/**
 * An abstract interface of a SceneGraph. Exposes methods for use by other code, but leaves the implementation up to the subclasses.
 */
export default abstract class SceneGraph {
	protected viewport: Viewport;
	protected nodeMap: Map<CanvasNode>;
	protected idCounter: number;
	protected scene: Scene;
	protected layers: Stack<Layer>;

    constructor(viewport: Viewport, scene: Scene){
		this.viewport = viewport;
		this.scene = scene;
		this.nodeMap = new Map<CanvasNode>();
		this.idCounter = 0;
		this.layers = new Stack(10);
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
    getNodeAt(vecOrX: Vec2 | number, y: number = null): CanvasNode {
		if(vecOrX instanceof Vec2){
			return this.getNodeAtCoords(vecOrX.x, vecOrX.y);
		} else {
			return this.getNodeAtCoords(vecOrX, y);
		}
	}
	
	/**
	 * The specific implementation of getting a node at certain coordinates
	 * @param x 
	 * @param y 
	 */
    protected abstract getNodeAtCoords(x: number, y: number): CanvasNode;
	
	addLayer(): Layer {
		let layer = new Layer(this.scene);
		let depth = this.layers.size();
		layer.setDepth(depth);
        this.layers.push(layer);
        return layer;
    }

	getLayers(): Stack<Layer> {
		return this.layers;
	}

    abstract update(deltaT: number): void;

	/**
	 * Gets the visible set of CanvasNodes based on the viewport
	 */
    abstract getVisibleSet(): Array<CanvasNode>;
}