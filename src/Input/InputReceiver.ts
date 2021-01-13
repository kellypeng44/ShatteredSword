import Receiver from "../Events/Receiver";
import Map from "../DataTypes/Map";
import Vec2 from "../DataTypes/Vec2";
import EventQueue from "../Events/EventQueue";
import Viewport from "../SceneGraph/Viewport";
import GameEvent from "../Events/GameEvent";
import { GameEventType } from "../Events/GameEventType";

/**
 * Receives input events from the @reference[EventQueue] and allows for easy access of information about input by other systems
 */
export default class InputReceiver{
	private static instance: InputReceiver = null;

	private mousePressed: boolean;
	private mouseJustPressed: boolean;

	private keyJustPressed: Map<boolean>;
	private keyPressed: Map<boolean>;

	private mousePosition: Vec2;
	private mousePressPosition: Vec2;

	private scrollDirection: number;
	private justScrolled: boolean;

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
		this.scrollDirection = 0;
		this.justScrolled = false;

		this.eventQueue = EventQueue.getInstance();
		// Subscribe to all input events
		this.eventQueue.subscribe(this.receiver, [GameEventType.MOUSE_DOWN, GameEventType.MOUSE_UP, GameEventType.MOUSE_MOVE,
			 GameEventType.KEY_DOWN, GameEventType.KEY_UP, GameEventType.CANVAS_BLUR, GameEventType.WHEEL_UP, GameEventType.WHEEL_DOWN]);
	}

	/**
	 * Gets the statc instance of the Singleton InputReceiver
	 * @returns The InputReceiver instance
	 */
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
		this.justScrolled = false;
		this.scrollDirection = 0;

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
				let key = event.data.get("key");
				// Handle space bar
				if(key === " "){
					key = "space";
				}
				if(!this.keyPressed.get(key)){
					this.keyJustPressed.set(key, true);
					this.keyPressed.set(key, true);
				}
			}

			if(event.type === GameEventType.KEY_UP){
				let key = event.data.get("key");
				// Handle space bar
				if(key === " "){
					key = "space";
				}
				this.keyPressed.set(key, false);
			}

			if(event.type === GameEventType.CANVAS_BLUR){
				this.clearKeyPresses()
			}

			if(event.type === GameEventType.WHEEL_UP){
				this.scrollDirection = -1;
				this.justScrolled = true;
			} else if(event.type === GameEventType.WHEEL_DOWN){
				this.scrollDirection = 1;
				this.justScrolled = true;
			}
		}
	}

	private clearKeyPresses(): void {
		this.keyJustPressed.forEach((key: string) => this.keyJustPressed.set(key, false));
		this.keyPressed.forEach((key: string) => this.keyPressed.set(key, false));
	}

	/**
	 * Returns whether or not a key was newly pressed this frame.
	 * If the key is still pressed from last frame and wasn't re-pressed, this will return false.
	 * @param key The key
	 * @returns True if the key was just pressed, false otherwise
	 */
	isJustPressed(key: string): boolean {
		if(this.keyJustPressed.has(key)){
			return this.keyJustPressed.get(key)
		} else {
			return false;
		}
	}

	/**
	 * Returns an array of all of the keys that are newly pressed this frame.
	 * If a key is still pressed from last frame and wasn't re-pressed, it will not be in this list.
	 * @returns An array of all of the newly pressed keys.
	 */
	getKeysJustPressed(): Array<string> {
		let keys = Array<string>();
		this.keyJustPressed.forEach(key => {
			if(this.keyJustPressed.get(key)){
				keys.push(key);
			}
		});
		return keys;
	}

	/**
	 * Returns whether or not a key is being pressed.
	 * @param key The key
	 * @returns True if the key is currently pressed, false otherwise
	 */
	isPressed(key: string): boolean {
		if(this.keyPressed.has(key)){
			return this.keyPressed.get(key)
		} else {
			return false;
		}
	}

	/**
	 * Returns whether or not the mouse was newly pressed this frame
	 * @returns True if the mouse was just pressed, false otherwise
	 */
	isMouseJustPressed(): boolean {
		return this.mouseJustPressed;
	}

	/**
	 * Returns whether or not the mouse is currently pressed
	 * @returns True if the mouse is currently pressed, false otherwise
	 */
	isMousePressed(): boolean {
		return this.mousePressed;
	}

	/**
	 * Returns whether the user scrolled or not
	 * @returns True if the user just scrolled this frame, false otherwise
	 */
	didJustScroll(): boolean {
		return this.justScrolled;
	}

	/**
	 * Gets the direction of the scroll
	 * @returns -1 if the user scrolled up, 1 if they scrolled down
	 */
	getScrollDirection(): number {
		return this.scrollDirection;
	}

	/**
	 * Gets the position of the player's mouse
	 * @returns The mouse position stored as a Vec2
	 */
	getMousePosition(): Vec2 {
		return this.mousePosition;
	}

	/**
	 * Gets the position of the player's mouse in the game world,
	 * taking into consideration the scrolling of the viewport
	 * @returns The mouse position stored as a Vec2
	 */
	getGlobalMousePosition(): Vec2 {
		return this.mousePosition.clone().add(this.viewport.getOrigin());
	}

	/**
	 * Gets the position of the last mouse press
	 * @returns The mouse position stored as a Vec2
	 */
	getMousePressPosition(): Vec2 {
		return this.mousePressPosition;
	}

	/**
	 * Gets the position of the last mouse press in the game world,
	 * taking into consideration the scrolling of the viewport
	 * @returns The mouse position stored as a Vec2
	 */
	getGlobalMousePressPosition(): Vec2 {
		return this.mousePressPosition.clone().add(this.viewport.getOrigin());
	}

	/**
	 * Gives the input receiver a reference to the viewport
	 * @param viewport The viewport
	 */
	setViewport(viewport: Viewport): void {
		this.viewport = viewport;
	}
}