import Queue from "../DataTypes/Queue";
import EventQueue from "./EventQueue";
import GameEvent from "./GameEvent";

/**
 * Receives subscribed events from the EventQueue
 */
export default class Receiver{
	readonly MAX_SIZE: number;
	private q: Queue<GameEvent>;

	constructor(){
		this.MAX_SIZE = 100;
        this.q = new Queue(this.MAX_SIZE);
	}
	
	/**
	 * Adds these types of events to this receiver's queue every update.
	 * @param eventTypes The types of events this receiver will be subscribed to
	 */
	subscribe(eventTypes: string | Array<string>): void {
		EventQueue.getInstance().subscribe(this, eventTypes);
	}

	/**
	 * Adds an event to the queue of this reciever
	 */
	receive(event: GameEvent): void {
		this.q.enqueue(event);
	}

	/**
	 * Retrieves the next event from the receiver's queue
	 */
	getNextEvent(): GameEvent {
		return this.q.dequeue();
	}

	/**
	 * Looks at the next event in the receiver's queue
	 */
	peekNextEvent(): GameEvent {
		return this.q.peekNext()
	}

	/**
	 * Returns true if the receiver has any events in its queue
	 */
	hasNextEvent(): boolean {
		return this.q.hasItems();
	}

	/**
	 * Ignore all events this frame
	 */
	ignoreEvents(): void {
		this.q.clear();
	}
}