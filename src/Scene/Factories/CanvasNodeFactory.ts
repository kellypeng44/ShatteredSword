import Scene from "../Scene";
import UIElement from "../../Nodes/UIElement";
import Layer from "../Layer";
import Graphic from "../../Nodes/Graphic";
import Sprite from "../../Nodes/Sprites/Sprite";
import { GraphicType } from "../../Nodes/Graphics/GraphicTypes";
import { UIElementType } from "../../Nodes/UIElements/UIElementTypes";
import Point from "../../Nodes/Graphics/Point";
import Vec2 from "../../DataTypes/Vec2";
import Shape from "../../DataTypes/Shapes/Shape";
import Button from "../../Nodes/UIElements/Button";
import Label from "../../Nodes/UIElements/Label";
import Rect from "../../Nodes/Graphics/Rect";

export default class CanvasNodeFactory {
	private scene: Scene;

	init(scene: Scene): void {
		this.scene = scene;
	}

	/**
	 * Adds an instance of a UIElement to the current scene - i.e. any class that extends UIElement
	 * @param type The type of UIElement to add
	 * @param layerName The layer to add the UIElement to
	 * @param options Any additional arguments to feed to the constructor
	 */
	addUIElement = (type: string | UIElementType, layerName: string, options?: Record<string, any>): UIElement => {
		// Get the layer
		let layer = this.scene.getLayer(layerName);

		let instance: UIElement;

		switch(type){
			case UIElementType.BUTTON:
				instance = this.buildButton(options);
			break;
			case UIElementType.LABEL:
				instance = this.buildLabel(options);
			break;
			default:
				throw `UIElementType '${type}' does not exist, or is registered incorrectly.`
		}

		instance.setScene(this.scene);
		instance.id = this.scene.generateId();
		this.scene.getSceneGraph().addNode(instance);

		// Add instance to layer
		layer.addNode(instance)

		return instance;
	}

	/**
	 * Adds a sprite to the current scene
	 * @param key The key of the image the sprite will represent
	 * @param layerName The layer on which to add the sprite
	 */
	addSprite = (key: string, layerName: string): Sprite => {
		let layer = this.scene.getLayer(layerName);

		let instance = new Sprite(key);

		// Add instance to scene
		instance.setScene(this.scene);
		instance.id = this.scene.generateId();
		this.scene.getSceneGraph().addNode(instance);

		// Add instance to layer
		layer.addNode(instance);

		return instance;
	}

	/**
	 * Adds a new graphic element to the current Scene
	 * @param type The type of graphic to add
	 * @param layerName The layer on which to add the graphic
	 * @param options Any additional arguments to send to the graphic constructor
	 */
	addGraphic = (type: GraphicType | string, layerName: string, options?: Record<string, any>): Graphic => {
		// Get the layer
		let layer = this.scene.getLayer(layerName);

		let instance: Graphic;

		switch(type){
			case GraphicType.POINT:
				instance = this.buildPoint(options);
			break;
			case GraphicType.RECT:
				instance = this.buildRect(options);
			break;
			default:
				throw `GraphicType '${type}' does not exist, or is registered incorrectly.`
		}

		// Add instance to scene
		instance.setScene(this.scene);
		instance.id = this.scene.generateId();

		if(!(this.scene.isParallaxLayer(layerName) || this.scene.isUILayer(layerName))){
			this.scene.getSceneGraph().addNode(instance);
		}

		// Add instance to layer
		layer.addNode(instance);

		return instance;
	}

	/* ---------- BUILDERS ---------- */

	buildButton(options?: Record<string, any>): Button {
		this.checkIfPropExists("Button", options, "position", Vec2, "Vec2");
		this.checkIfPropExists("Button", options, "text", "string");

		return new Button(options.position, options.text);
	}

	buildLabel(options?: Record<string, any>): Label {
		this.checkIfPropExists("Label", options, "position", Vec2, "Vec2");
		this.checkIfPropExists("Label", options, "text", "string");

		return new Label(options.position, options.text)
	}

	buildPoint(options?: Record<string, any>): Point {
		this.checkIfPropExists("Point", options, "position", Vec2, "Vec2");

		return new Point(options.position);
	}

	buildRect(options?: Record<string, any>): Rect {
		this.checkIfPropExists("Rect", options, "position", Vec2, "Vec2");
		this.checkIfPropExists("Rect", options, "size", Vec2, "Vec2");

		return new Rect(options.position, options.size);
	}

	/* ---------- ERROR HANDLING ---------- */

	checkIfPropExists<T>(objectName: string, options: Record<string, any>, prop: string, type: (new (...args: any) => T) | string, typeName?: string){
		if(!options || !options[prop]){
			// Check that the options object has the property
			throw `${objectName} object requires argument ${prop} of type ${typeName}, but none was provided.`;
		} else {
			// Check that the property has the correct type
			if((typeof type) === "string"){
				if(!(typeof options[prop] === type)){
					throw `${objectName} object requires argument ${prop} of type ${type}, but provided ${prop} was not of type ${type}.`;
				}
			} else if(type instanceof Function){
				// If type is a constructor, check against that
				if(!(options[prop] instanceof type)){
					throw `${objectName} object requires argument ${prop} of type ${typeName}, but provided ${prop} was not of type ${typeName}.`;
				}
			} else {
				throw `${objectName} object requires argument ${prop} of type ${typeName}, but provided ${prop} was not of type ${typeName}.`;
			}
		}
	}
}