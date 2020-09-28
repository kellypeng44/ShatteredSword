import Scene from "../Scene";
import PhysicsNode from "../../Physics/PhysicsNode";
import PhysicsManager from "../../Physics/PhysicsManager";
import Layer from "../Layer";

export default class PhysicsNodeFactory {
	private scene: Scene;
	private physicsManager: PhysicsManager;

	init(scene: Scene, physicsManager: PhysicsManager): void {
		this.scene = scene;
        this.physicsManager = physicsManager;
	}

	// TODO: Currently this doesn't care about layers
	/**
	 * Adds a new PhysicsNode to the scene on the specified Layer
	 * @param constr The constructor of the PhysicsNode to be added to the scene
	 * @param layer The layer on which to add the PhysicsNode
	 * @param args Any additional arguments to send to the PhysicsNode constructor
	 */
	add = <T extends PhysicsNode>(constr: new (...a: any) => T, layer: Layer, ...args: any): T => {
		let instance = new constr(...args);
		instance.setScene(this.scene);
		instance.setId(this.scene.generateId());
        instance.addManager(this.physicsManager);
		instance.create();
		
		layer.addNode(instance);

		this.physicsManager.add(instance);
		return instance;
	}
}