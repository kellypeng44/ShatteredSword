import EventQueue from "../Events/EventQueue";
import InputReceiver from "../Input/InputReceiver";
import Vec2 from "../DataTypes/Vec2";
import Receiver from "../Events/Receiver";
import Emitter from "../Events/Emitter";
import Scene from "../Scene/Scene";
import Layer from "../Scene/Layer";
import { Positioned, Unique } from "../DataTypes/Interfaces/Descriptors"
import UIElement from "./UIElement";
import Behavior from "../Behaviors/Behavior";

/**
 * The representation of an object in the game world
 */
export default abstract class GameNode implements Positioned, Unique {
	protected input: InputReceiver;
	private _position: Vec2;
	protected receiver: Receiver;
	protected emitter: Emitter;
	protected scene: Scene;
	protected layer: Layer;
	private id: number;
	protected behaviors: Array<Behavior>;

	constructor(){
		this.input = InputReceiver.getInstance();
		this._position = new Vec2(0, 0);
		this._position.setOnChange(this.positionChanged);
		this.receiver = new Receiver();
		this.emitter = new Emitter();
		this.behaviors = new Array();
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
	 * Adds a behavior to the list of behaviors in this GameNode
	 * @param behavior The behavior to add to this GameNode
	 */
	addBehavior(behavior: Behavior): void {
		this.behaviors.push(behavior);
	}

	/**
	 * Does all of the behaviors of this GameNode
	 */
	doBehaviors(deltaT: number): void {
		this.behaviors.forEach(behavior => behavior.doBehavior(deltaT));
	}

	getBehavior<T extends Behavior>(constr: new (...args: any) => T): T {
		let query = null;

		for(let behavior of this.behaviors){
			if(behavior instanceof constr){
				query = <T>behavior;
			}
		}

		return query;
	}

	/**
	 * Called if the position vector is modified or replaced
	 */
	protected positionChanged = (): void => {};

	// TODO - This doesn't seem ideal. Is there a better way to do this?
	getViewportOriginWithParallax(): Vec2 {
		return this.scene.getViewport().getOrigin().mult(this.layer.getParallax());
	}

	abstract update(deltaT: number): void;
}