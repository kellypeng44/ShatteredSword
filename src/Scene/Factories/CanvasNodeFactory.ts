import Scene from "../Scene";
import SceneGraph from "../../SceneGraph/SceneGraph";
import UIElement from "../../Nodes/UIElement";
import Layer from "../Layer";
import Graphic from "../../Nodes/Graphic";
import Sprite from "../../Nodes/Sprites/Sprite";

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

	addSprite = (imageId: string, layer: Layer, ...args: any): Sprite => {
		let instance = new Sprite(imageId);

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