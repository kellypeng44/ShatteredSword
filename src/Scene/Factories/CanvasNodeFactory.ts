import Layer from "../Layer";
import Viewport from "../../SceneGraph/Viewport";
import CanvasItem from "../../Nodes/CanvasNode"

export default class CanvasNodeFactory {
	private scene: Layer;

	constructor(scene: Layer){
		this.scene = scene;
	}

	add<T extends CanvasItem>(constr: new (...a: any) => T, ...args: any): T {
		let instance = new constr(...args);
		instance.init(this.scene);
		this.scene.add(instance);
		return instance;
	}
}