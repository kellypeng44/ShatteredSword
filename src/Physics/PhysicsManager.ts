import GameNode from "../Nodes/GameNode";
import Vec2 from "../DataTypes/Vec2";
import { Updateable } from "../DataTypes/Interfaces/Descriptors";
import Tilemap from "../Nodes/Tilemap";
import Receiver from "../Events/Receiver";
import Emitter from "../Events/Emitter";
import Map from "../DataTypes/Map";

export default abstract class PhysicsManager implements Updateable {
	protected receiver: Receiver;
	protected emitter: Emitter;

	/**	Layer names to numbers */
	protected layerMap: Map<number>;

	/** Layer numbers to names */
	protected layerNames: Array<string>;

	constructor(){
		this.receiver = new Receiver();
		this.emitter = new Emitter();

		// The creation and implementation of layers is deferred to the subclass
		this.layerMap = new Map();
		this.layerNames = new Array();
	}

	/**
	 * Registers a gamenode with this physics manager
	 * @param object 
	 */
	abstract registerObject(object: GameNode): void;

	/**
	 * Registers a tilemap with this physics manager
	 * @param tilemap 
	 */
	abstract registerTilemap(tilemap: Tilemap): void;

	/**
	 * Updates the physics
	 * @param deltaT 
	 */
	abstract update(deltaT: number): void;

	setLayer(node: GameNode, layer: string): void {
		node.physicsLayer = this.layerMap.get(layer);
	}
}