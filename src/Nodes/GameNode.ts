import EventQueue from "../Events/EventQueue";
import InputReceiver from "../Input/InputReceiver";
import Vec2 from "../DataTypes/Vec2";
import Map from "../DataTypes/Map";
import Receiver from "../Events/Receiver";
import GameEvent from "../Events/GameEvent";

export default abstract class GameNode{
	private eventQueue: EventQueue;
	protected input: InputReceiver;
	protected position: Vec2;
	private receiver: Receiver;

	constructor(){
		this.eventQueue = EventQueue.getInstance();
		this.input = InputReceiver.getInstance();
		this.position = new Vec2(0, 0);
	}
	
	getPosition(): Vec2 {
		return this.position;
	}

	subscribe(eventType: string){
		this.eventQueue.subscribe(this.receiver, eventType);
	}

	emit(eventType: string, data: Map<any> | Record<string, any> = null){
		let event = new GameEvent(eventType, data);
		this.eventQueue.addEvent(event);
	}

	abstract update(deltaT: number): void;

	abstract render(ctx: CanvasRenderingContext2D, viewportOrigin: Vec2, viewportSize: Vec2): void;
}