import Scene from "../Scene";
import CanvasItem from "../../Nodes/CanvasNode"
import SceneGraph from "../../SceneGraph/SceneGraph";
import UIElement from "../../Nodes/UIElement";
import Layer from "../Layer";
import Graphic from "../../Nodes/Graphic";

export default class CanvasNodeFactory {
	private scene: Scene;
	private sceneGraph: SceneGraph;

	init(scene: Scene, sceneGraph: SceneGraph): void {
		this.scene = scene;
		this.sceneGraph = sceneGraph;
	}

	addUIElement = <T extends UIElement>(constr: new (...a: any) => T, layer: Layer, ...args: any): T => {
		let instance = new constr(...args);

		// Add instance to scene
		instance.setScene(this.scene);
		this.sceneGraph.addNode(instance);

		// Add instance to layer
		layer.addNode(instance);

		return instance;
	}

	addSprite = <T extends CanvasItem>(constr: new (...a: any) => T, layer: Layer, ...args: any): T => {
		let instance = new constr(...args);

		// Add instance to scene
		instance.setScene(this.scene);
		this.sceneGraph.addNode(instance);

		// Add instance to layer
		layer.addNode(instance);

		return instance;
	}

	addGraphic = <T extends Graphic>(constr: new (...a: any) => T, layer: Layer, ...args: any): T => {
		let instance = new constr(...args);

		// Add instance to scene
		instance.setScene(this.scene);
		this.sceneGraph.addNode(instance);

		// Add instance to layer
		layer.addNode(instance);

		return instance;
	}
}