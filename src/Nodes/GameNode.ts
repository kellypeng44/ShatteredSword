import EventQueue from "../Events/EventQueue";
import InputReceiver from "../Input/InputReceiver";
import Vec2 from "../DataTypes/Vec2";

export default abstract class GameNode{
	protected eventQueue: EventQueue;
	protected input: InputReceiver;
	protected position: Vec2;
	protected size: Vec2;

	constructor(){
		this.eventQueue = EventQueue.getInstance();
		this.input = InputReceiver.getInstance();
		this.position = new Vec2(0, 0);
		this.size = new Vec2(0, 0);
	}
	
	getPosition(): Vec2 {
		return this.position;
	}

	getSize(): Vec2 {
		return this.size;
	}

	contains(x: number, y: number): boolean {
		if(x > this.position.x && x < this.position.x + this.size.x){
			if(y > this.position.y && y < this.position.y + this.size.y){
				return true;
			}
		}
		return false;
	}

	abstract update(deltaT: number): void;

	abstract render(ctx: CanvasRenderingContext2D, viewportOrigin: Vec2, viewportSize: Vec2): void;
}