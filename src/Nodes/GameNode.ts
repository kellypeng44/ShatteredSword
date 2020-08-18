import EventQueue from "../Events/EventQueue";
import InputReceiver from "../Input/InputReceiver";
import Vec2 from "../DataTypes/Vec2";
import Map from "../DataTypes/Map";
import Receiver from "../Events/Receiver";
import GameEvent from "../Events/GameEvent";
import Scene from "../GameState/Scene";

export default abstract class GameNode{
	private eventQueue: EventQueue;
	protected input: InputReceiver;
	protected position: Vec2;
	private receiver: Receiver;
	protected scene: Scene;

	constructor(){
		this.eventQueue = EventQueue.getInstance();
		this.input = InputReceiver.getInstance();
		this.position = new Vec2(0, 0);
	}

	init(scene: Scene){
		this.scene = scene;
	}

	getScene(): Scene {
		return this.scene;
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

	subscribe(eventType: string){
		this.eventQueue.subscribe(this.receiver, eventType);
	}

	emit(eventType: string, data: Map<any> | Record<string, any> = null){
		let event = new GameEvent(eventType, data);
		this.eventQueue.addEvent(event);
	}

	abstract update(deltaT: number): void;
}