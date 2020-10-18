import InputReceiver from "../Input/InputReceiver";
import Vec2 from "../DataTypes/Vec2";
import Receiver from "../Events/Receiver";
import Emitter from "../Events/Emitter";
import Scene from "../Scene/Scene";
import Layer from "../Scene/Layer";
import { Positioned, Unique, Updateable } from "../DataTypes/Interfaces/Descriptors"

/**
 * The representation of an object in the game world
 */
export default abstract class GameNode implements Positioned, Unique, Updateable {
	protected input: InputReceiver;
	private _position: Vec2;
	protected receiver: Receiver;
	protected emitter: Emitter;
	protected scene: Scene;
	protected layer: Layer;
	private id: number;

	constructor(){
		this.input = InputReceiver.getInstance();
		this._position = new Vec2(0, 0);
		this._position.setOnChange(this.positionChanged);
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
	
	get position(): Vec2 {
		return this._position;
	}

	set position(pos: Vec2) {
		this._position = pos;
		this._position.setOnChange(this.positionChanged);
		this.positionChanged();
	}

	getPosition(): Vec2 {
		return this._position.clone();
	}

	setPosition(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.position.set(vecOrX.x, vecOrX.y);
		} else {
			this.position.set(vecOrX, y);
		}
	}

	setId(id: number): void {
		this.id = id;
	}

	getId(): number {
		return this.id;
	}

	/**
	 * Called if the position vector is modified or replaced
	 */
	protected positionChanged = (): void => {};

	// TODO - This doesn't seem ideal. Is there a better way to do this?
	getViewportOriginWithParallax(): Vec2 {
		return this.scene.getViewport().getOrigin().mult(this.layer.getParallax());
	}

	getViewportScale(): number {
		return this.scene.getViewport().getZoomLevel();
	}


	abstract update(deltaT: number): void;
}