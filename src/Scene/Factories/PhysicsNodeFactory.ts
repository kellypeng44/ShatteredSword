import Layer from "../Layer";
import Viewport from "../../SceneGraph/Viewport";
import PhysicsNode from "../../Physics/PhysicsNode";
import PhysicsManager from "../../Physics/PhysicsManager";
import Tilemap from "../../Nodes/Tilemap";

export default class PhysicsNodeFactory {
	private scene: Layer;
	private physicsManager: PhysicsManager;

	constructor(scene: Layer, physicsManager: PhysicsManager){
        this.scene = scene;
        this.physicsManager = physicsManager;
	}

	add<T extends PhysicsNode>(constr: new (...a: any) => T, ...args: any): T {
		let instance = new constr(...args);
        instance.init(this.scene);
        instance.addManager(this.physicsManager);
        instance.create();
		this.physicsManager.add(instance);
		return instance;
	}

	addTilemap(tilemap: Tilemap): void {
		this.physicsManager.addTilemap(tilemap);
	}
}