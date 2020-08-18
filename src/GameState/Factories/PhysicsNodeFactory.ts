import Scene from "../Scene";
import Viewport from "../../SceneGraph/Viewport";
import PhysicsNode from "../../Physics/PhysicsNode";
import PhysicsManager from "../../Physics/PhysicsManager";

export default class PhysicsNodeFactory {
	private scene: Scene;
	private physicsManager: PhysicsManager;

	constructor(scene: Scene, physicsManager: PhysicsManager){
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
}