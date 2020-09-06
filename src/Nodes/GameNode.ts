import EventQueue from "../Events/EventQueue";
import InputReceiver from "../Input/InputReceiver";
import Vec2 from "../DataTypes/Vec2";
import Map from "../DataTypes/Map";
import Receiver from "../Events/Receiver";
import GameEvent from "../Events/GameEvent";
import Scene from "../Scene/Scene";
import Layer from "../Scene/Layer";

export default abstract class GameNode{
	private eventQueue: EventQueue;
	protected input: InputReceiver;
	protected position: Vec2;
	private receiver: Receiver;
	protected scene: Scene;
	protected layer: Layer;

	constructor(){
		this.eventQueue = EventQueue.getInstance();
		this.input = InputReceiver.getInstance();
		this.position = new Vec2(0, 0);
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

	subscribe(eventType: string): void {
		this.eventQueue.subscribe(this.receiver, eventType);
	}

	emit(eventType: string, data: Map<any> | Record<string, any> = null): void {
		let event = new GameEvent(eventType, data);
		this.eventQueue.addEvent(event);
	}

	// TODO - This doesn't seem ideal. Is there a better way to do this?
	getViewportOriginWithParallax(){
		return this.scene.getViewport().getPosition().clone().mult(this.layer.getParallax());
	}

	abstract update(deltaT: number): void;
}