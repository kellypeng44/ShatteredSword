import EventQueue from "../Events/EventQueue";
import Vec2 from "../DataTypes/Vec2";
import GameEvent from "../Events/GameEvent";

export default class InputHandler{
	private eventQueue: EventQueue;
	 
    constructor(canvas: HTMLCanvasElement){
		this.eventQueue = EventQueue.getInstance();
		
        canvas.onmousedown = (event) => this.handleMouseDown(event, canvas);
        canvas.onmouseup = (event) => this.handleMouseUp(event, canvas);
        document.onkeydown = this.handleKeyDown;
        document.onkeyup = this.handleKeyUp;
    }

    private handleMouseDown = (event: MouseEvent, canvas: HTMLCanvasElement): void => {
		let pos = this.getMousePosition(event, canvas);
        let gameEvent = new GameEvent("mouse_down", {position: pos});
        this.eventQueue.addEvent(gameEvent);
    }

    private handleMouseUp = (event: MouseEvent, canvas: HTMLCanvasElement): void => {
        let pos = this.getMousePosition(event, canvas);
        let gameEvent = new GameEvent("mouse_up", {position: pos});
        this.eventQueue.addEvent(gameEvent);
    }

    private handleKeyDown = (event: KeyboardEvent): void => {
        let key = this.getKey(event);
        let gameEvent = new GameEvent("key_down", {key: key});
        this.eventQueue.addEvent(gameEvent);
    }

    private handleKeyUp = (event: KeyboardEvent): void => {
        let key = this.getKey(event);
        let gameEvent = new GameEvent("key_up", {key: key});
        this.eventQueue.addEvent(gameEvent);
    }

    private getKey(keyEvent: KeyboardEvent){
        return keyEvent.key.toLowerCase();
    }

    private getMousePosition(mouseEvent: MouseEvent, canvas: HTMLCanvasElement): Vec2 {
        let rect = canvas.getBoundingClientRect();
        let x = mouseEvent.clientX - rect.left;
        let y = mouseEvent.clientY - rect.top;
        return new Vec2(x, y);
    }
}