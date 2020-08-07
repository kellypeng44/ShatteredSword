import Queue from "../DataTypes/Queue";
import GameEvent from "./GameEvent";

export default class Receiver{
	readonly MAX_SIZE: number;
	private q: Queue<GameEvent>;

	constructor(){
		this.MAX_SIZE = 100;
        this.q = new Queue(this.MAX_SIZE);
	}

	receive(event: GameEvent): void {
		this.q.enqueue(event);
	}

	getNextEvent(): GameEvent {
		return this.q.dequeue();
	}

	peekNextEvent(): GameEvent {
		return this.q.peekNext()
	}

	hasNextEvent(): boolean {
		return this.q.hasItems();
	}

	ignoreEvents(): void {
		this.q.clear();
	}
}