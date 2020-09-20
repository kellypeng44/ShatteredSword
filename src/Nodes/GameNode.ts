import EventQueue from "../Events/EventQueue";
import InputReceiver from "../Input/InputReceiver";
import Vec2 from "../DataTypes/Vec2";
import Receiver from "../Events/Receiver";
import Emitter from "../Events/Emitter";
import Scene from "../Scene/Scene";
import Layer from "../Scene/Layer";

/**
 * The representation of an object in the game world
 */
export default abstract class GameNode {
	protected input: InputReceiver;
	protected position: Vec2;
	protected receiver: Receiver;
	protected emitter: Emitter;
	protected scene: Scene;
	protected layer: Layer;

	constructor(){
		this.input = InputReceiver.getInstance();
		this.position = new Vec2(0, 0);
		this.receiver = new Receiver();
		this.emitter = new Emitter();
	}

	setScene(scene: Scene): void {
		this.scene = scene;
	}

	getScene(): Scene {
		return this.scene;
	}

	setLayer(layer: Layer): void {
		this.layer = layer;
	}

	getLayer(): Layer {
		return this.layer;
	}
	
	getPosition(): Vec2 {
		return this.position;
	}

	setPosition(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.position.set(vecOrX.x, vecOrX.y);
		} else {
			this.position.set(vecOrX, y);
		}
	}

	// TODO - This doesn't seem ideal. Is there a better way to do this?
	protected getViewportOriginWithParallax(): Vec2 {
		return this.scene.getViewport().getPosition().clone().mult(this.layer.getParallax());
	}

	abstract update(deltaT: number): void;
}