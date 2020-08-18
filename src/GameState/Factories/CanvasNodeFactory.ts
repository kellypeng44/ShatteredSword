import Scene from "../Scene";
import Viewport from "../../SceneGraph/Viewport";
import CanvasItem from "../../Nodes/CanvasNode"
import PlayerSprite from "../../Nodes/PlayerSprite";

export default class CanvasNodeFactory {
	private scene: Scene;
	private viewport: Viewport;

	constructor(scene: Scene, viewport: Viewport){
		this.scene = scene;
	}

	add<T extends CanvasItem>(constr: new (...a: any) => T, ...args: any): T {
		let instance = new constr(...args);
		instance.init(this.scene);
		this.scene.add(instance);
		return instance;
	}
}