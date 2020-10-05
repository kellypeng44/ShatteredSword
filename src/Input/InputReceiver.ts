import Receiver from "../Events/Receiver";
import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";
import EventQueue from "../Events/EventQueue";
import Viewport from "../SceneGraph/Viewport";
import GameEvent from "../Events/GameEvent";
import { GameEventType } from "../Events/GameEventType";

/**
 * Receives input events from the event queue and allows for easy access of information about input
 */
export default class InputReceiver{
	private static instance: InputReceiver = null;

	private mousePressed: boolean;
	private mouseJustPressed: boolean;
	private keyJustPressed: Map<boolean>;
	private keyPressed: Map<boolean>;
	private mousePosition: Vec2;
	private mousePressPosition: Vec2;
	private eventQueue: EventQueue;
	private receiver: Receiver;
	private viewport: Viewport;

	private constructor(){
		this.mousePressed = false;
		this.mouseJustPressed = false;
		this.receiver = new Receiver();
		this.keyJustPressed = new Map<boolean>();
		this.keyPressed = new Map<boolean>();
		this.mousePosition = new Vec2(0, 0);
		this.mousePressPosition = new Vec2(0, 0);

		this.eventQueue = EventQueue.getInstance();
		// Subscribe to all input events
		this.eventQueue.subscribe(this.receiver, [GameEventType.MOUSE_DOWN, GameEventType.MOUSE_UP, GameEventType.MOUSE_MOVE,
			 GameEventType.KEY_DOWN, GameEventType.KEY_UP, GameEventType.CANVAS_BLUR]);
	}

	static getInstance(): InputReceiver{
		if(this.instance === null){
			this.instance = new InputReceiver();
		}
		return this.instance;
	}

	update(deltaT: number): void {
		// Reset the justPressed values to false
		this.mouseJustPressed = false;
		this.keyJustPressed.forEach((key: string) => this.keyJustPressed.set(key, false));

		while(this.receiver.hasNextEvent()){			
			let event = this.receiver.getNextEvent();
			
			// Handle each event type
			if(event.type === GameEventType.MOUSE_DOWN){
				this.mouseJustPressed = true;
				this.mousePressed = true;
				this.mousePressPosition = event.data.get("position");	
			}

			if(event.type === GameEventType.MOUSE_UP){
				this.mousePressed = false;
			}

			if(event.type === GameEventType.MOUSE_MOVE){
				this.mousePosition = event.data.get("position");
			}

			if(event.type === GameEventType.KEY_DOWN){
				let key = event.data.get("key")
				if(!this.keyPressed.get(key)){
					this.keyJustPressed.set(key, true);
					this.keyPressed.set(key, true);
				}
			}

			if(event.type === GameEventType.KEY_UP){
				let key = event.data.get("key")
				this.keyPressed.set(key, false);
			}

			if(event.type === GameEventType.CANVAS_BLUR){
				this.clearKeyPresses()
			}
		}
	}

	private clearKeyPresses(): void {
		this.keyJustPressed.forEach((key: string) => this.keyJustPressed.set(key, false));
		this.keyPressed.forEach((key: string) => this.keyPressed.set(key, false));
	}

	isJustPressed(key: string): boolean {
		if(this.keyJustPressed.has(key)){
			return this.keyJustPressed.get(key)
		} else {
			return false;
		}
	}

	isPressed(key: string): boolean {
		if(this.keyPressed.has(key)){
			return this.keyPressed.get(key)
		} else {
			return false;
		}
	}

	isMouseJustPressed(): boolean {
		return this.mouseJustPressed;
	}

	isMousePressed(): boolean {
		return this.mousePressed;
	}

	getMousePosition(): Vec2 {
		return this.mousePosition;
	}

	getGlobalMousePosition(): Vec2 {
		return this.mousePosition.clone().add(this.viewport.getOrigin());
	}

	getMousePressPosition(): Vec2 {
		return this.mousePressPosition;
	}

	getGlobalMousePressPosition(): Vec2 {
		return this.mousePressPosition.clone().add(this.viewport.getOrigin());
	}

	setViewport(viewport: Viewport): void {
		this.viewport = viewport;
	}
}