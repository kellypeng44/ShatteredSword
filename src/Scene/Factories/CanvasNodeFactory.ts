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

	/**
	 * Adds an instance of a UIElement to the current scene - i.e. any class that extends UIElement
	 * @param constr The constructor of the UIElement to be created
	 * @param layer The layer to add the UIElement to
	 * @param args Any additional arguments to feed to the constructor
	 */
	addUIElement = <T extends UIElement>(constr: new (...a: any) => T, layer: Layer, ...args: any): T => {
		let instance = new constr(...args);

		// Add instance to scene
		instance.setScene(this.scene);
		this.sceneGraph.addNode(instance);

		// Add instance to layer
		layer.addNode(instance);

		return instance;
	}

	/**
	 * Adds a sprite to the current scene
	 * @param key The key of the image the sprite will represent
	 * @param layer The layer on which to add the sprite
	 */
	addSprite = (key: string, layer: Layer): Sprite => {
		let instance = new Sprite(key);

		// Add instance to scene
		instance.setScene(this.scene);
		this.sceneGraph.addNode(instance);

		// Add instance to layer
		layer.addNode(instance);

		return instance;
	}

	/**
	 * Adds a new graphic element to the current Scene
	 * @param constr The constructor of the graphic element to add
	 * @param layer The layer on which to add the graphic
	 * @param args Any additional arguments to send to the graphic constructor
	 */
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