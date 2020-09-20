import Map from "../DataTypes/Map";
import EventQueue from "./EventQueue";
import GameEvent from "./GameEvent";

export default class Emitter {
	private eventQueue: EventQueue;

	constructor(){
		this.eventQueue = EventQueue.getInstance();
	}

	/**
	 * Emit and event of type eventType with the data packet data
	 * @param eventType 
	 * @param data 
	 */
	fireEvent(eventType: string, data: Map<any> | Record<string, any> = null): void {
		this.eventQueue.addEvent(new GameEvent(eventType, data));
	}
}