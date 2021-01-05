import InputReceiver from "../Input/InputReceiver";
import Vec2 from "../DataTypes/Vec2";
import Receiver from "../Events/Receiver";
import Emitter from "../Events/Emitter";
import Scene from "../Scene/Scene";
import Layer from "../Scene/Layer";
import { Physical, Positioned, isRegion, Unique, Updateable, Actor, AI, DebugRenderable } from "../DataTypes/Interfaces/Descriptors"
import Shape from "../DataTypes/Shapes/Shape";
import Map from "../DataTypes/Map";
import AABB from "../DataTypes/Shapes/AABB";
import NavigationPath from "../Pathfinding/NavigationPath";
import TweenManager from "../Rendering/Animations/TweenManager";
import Debug from "../Debug/Debug";
import Color from "../Utils/Color";

/**
 * The representation of an object in the game world.
 * To construct GameNodes, see the @reference[Scene] documentation.
 */
export default abstract class GameNode implements Positioned, Unique, Updateable, Physical, Actor, DebugRenderable {
	/*---------- POSITIONED ----------*/
	private _position: Vec2;

	/*---------- UNIQUE ----------*/
	private _id: number;

	/*---------- PHYSICAL ----------*/
	hasPhysics: boolean;
	moving: boolean;
	onGround: boolean;
	onWall: boolean;
	onCeiling: boolean;
	active: boolean;
	collisionShape: Shape;
	colliderOffset: Vec2;
	isStatic: boolean;
	isCollidable: boolean;
	isTrigger: boolean;
	group: string;
	triggers: Map<string>;
	_velocity: Vec2;
	sweptRect: AABB;
	collidedWithTilemap: boolean;
	physicsLayer: number;
	isPlayer: boolean;
	isColliding: boolean = false;

	/*---------- ACTOR ----------*/
	_ai: AI;
	aiActive: boolean;
	actorId: number;
	path: NavigationPath;
	pathfinding: boolean = false;

	/*---------- GENERAL ----------*/
	/** An reference to the user input handler. This allows subclasses to easily access information about user input. */
	protected input: InputReceiver;
	/** An event receiver. */
	protected receiver: Receiver;
	/** An event emitter. */
	protected emitter: Emitter;
	/** A reference to the scene this GameNode is a part of. */
	protected scene: Scene;
	/** The visual layer this GameNode resides in. */
	protected layer: Layer;
	/** A utility that allows the use of tweens on this GameNode */
	tweens: TweenManager;
	/** A tweenable property for rotation. Does not affect the bounding box of this GameNode - Only rendering. */
	rotation: number;
	/** The opacity value of this GameNode */
	alpha: number;

	// Constructor docs are ignored, as the user should NOT create new GameNodes with a raw constructor
	constructor(){
		this.input = InputReceiver.getInstance();
		this._position = new Vec2(0, 0);
		this._position.setOnChange(() => this.positionChanged());
		this.receiver = new Receiver();
		this.emitter = new Emitter();
		this.tweens = new TweenManager(this);
		this.rotation = 0;
		this.alpha = 1;
	}

	/*---------- POSITIONED ----------*/
	get position(): Vec2 {
		return this._position;
	}

	set position(pos: Vec2) {
		this._position = pos;
		this._position.setOnChange(() => this.positionChanged());
		this.positionChanged();
	}

	get relativePosition(): Vec2 {
		let origin = this.scene.getViewTranslation(this);
		let zoom = this.scene.getViewScale();

		return this.position.clone().sub(origin).scale(zoom);
	}

	/*---------- UNIQUE ----------*/
	get id(): number {
		return this._id;
	}

	set id(id: number) {
		// id can only be set once
		if(this._id === undefined){
			this._id = id;
		} else {
			throw "Attempted to assign id to object that already has id."
		}
	}

	/*---------- PHYSICAL ----------*/
	// @implemented
	/**
     * @param velocity The velocity with which to move the object.
     */
	move(velocity: Vec2): void {
		this.moving = true;
		this._velocity = velocity;
	};

	// @implemented
    /**
     * @param velocity The velocity with which the object will move.
     */
	finishMove(): void {
		this.moving = false;
		this.position.add(this._velocity);
		if(this.pathfinding){
			this.path.handlePathProgress(this);
		}
	}

	// @implemented
	/**
	 * @param collisionShape The collider for this object. If this has a region (implements Region),
	 * it will be used when no collision shape is specified (or if collision shape is null).
	 * @param isCollidable Whether this is collidable or not. True by default.
	 * @param isStatic Whether this is static or not. False by default
	 */
	addPhysics(collisionShape?: Shape, colliderOffset?: Vec2, isCollidable: boolean = true, isStatic: boolean = false): void {
		// Initialize the physics variables
		this.hasPhysics = true;
		this.moving = false;
		this.onGround = false;
		this.onWall = false;
		this.onCeiling = false;
		this.active = true;
		this.isCollidable = isCollidable;
		this.isStatic = isStatic;
		this.isTrigger = false;
		this.group = "";
		this.triggers = new Map();
		this._velocity = Vec2.ZERO;
		this.sweptRect = new AABB();
		this.collidedWithTilemap = false;
		this.physicsLayer = -1;

		// Set the collision shape if provided, or simply use the the region if there is one.
		if(collisionShape){
			this.collisionShape = collisionShape;
		} else if (isRegion(this)) {
			// If the gamenode has a region and no other is specified, use that
			this.collisionShape = (<any>this).boundary.clone();
		} else {
			throw "No collision shape specified for physics object."
		}

		// If we were provided with a collider offset, set it. Otherwise there is no offset, so use the zero vector
		if(colliderOffset){
			this.colliderOffset = colliderOffset;
		} else {
			this.colliderOffset = Vec2.ZERO;
		}

		// Initialize the swept rect
		this.sweptRect = this.collisionShape.getBoundingRect();

		// Register the object with physics
		this.scene.getPhysicsManager().registerObject(this);
	}

	// @implemented
	/**
	 * @param group The name of the group that will activate the trigger
	 * @param eventType The type of this event to send when this trigger is activated
	 */
    addTrigger(group: string, eventType: string): void {
		this.isTrigger = true;
		this.triggers.add(group, eventType);
	};

	// @implemented
	/**
	 * @param layer The physics layer this node should belong to
	 */
	setPhysicsLayer(layer: string): void {
		this.scene.getPhysicsManager().setLayer(this, layer);
	}

	// @implemened
	getLastVelocity(): Vec2 {
		return this._velocity;
	}

	/*---------- ACTOR ----------*/
	get ai(): AI {
		return this._ai;
	}

	set ai(ai: AI) {
		if(!this._ai){
			// If we haven't been previously had an ai, register us with the ai manager
			this.scene.getAIManager().registerActor(this);
		}

		this._ai = ai;
		this.aiActive = true;
	}

	// @implemented
	addAI<T extends AI>(ai: string | (new () => T), options?: Record<string, any>): void {
		if(!this._ai){
			this.scene.getAIManager().registerActor(this);
		}

		if(typeof ai === "string"){
			this._ai = this.scene.getAIManager().generateAI(ai);
		} else {
			this._ai = new ai();
		}

		this._ai.initializeAI(this, options);

		this.aiActive = true;
	}

	// @implemented
	setAIActive(active: boolean): void {
		this.aiActive = active;
	}

	/*---------- TWEENABLE PROPERTIES ----------*/
	set positionX(value: number) {
		this.position.x = value;
	}

	set positionY(value: number) {
		this.position.y = value;
	}

	abstract set scaleX(value: number);

	abstract set scaleY(value: number);

	/*---------- GAME NODE ----------*/
	/**
	 * Sets the scene for this object.
	 * @param scene The scene this object belongs to.
	 */
	setScene(scene: Scene): void {
		this.scene = scene;
	}

	/**
	 * Gets the scene this object is in. 
	 * @returns The scene this object belongs to
	*/
	getScene(): Scene {
		return this.scene;
	}

	/**
	 * Sets the layer of this object.
	 * @param layer The layer this object will be on.
	 */
	setLayer(layer: Layer): void {
		this.layer = layer;
	}

	/**
	 * Returns the layer this object is on.
	 * @returns This layer this object is on.
	*/
	getLayer(): Layer {
		return this.layer;
	}

	/** Called if the position vector is modified or replaced */
	protected positionChanged(): void {
		if(this.hasPhysics){
			this.collisionShape.center = this.position.clone().add(this.colliderOffset);
		}
	};

	/**
	 * Updates this GameNode
	 * @param deltaT The timestep of the update.
	 */
	update(deltaT: number): void {
		this.tweens.update(deltaT);
	}

	// @implemented
	debugRender(): void {
		let color = this.isColliding ? Color.RED : Color.GREEN;
		Debug.drawPoint(this.relativePosition, color);

		// If velocity is not zero, draw a vector for it
		if(this._velocity && !this._velocity.isZero()){
			Debug.drawRay(this.relativePosition, this._velocity.clone().scaleTo(20).add(this.relativePosition), color);
		}

		// If this has a collider, draw it
		if(this.isCollidable && this.collisionShape){
			Debug.drawBox(this.collisionShape.center, this.collisionShape.halfSize, false, Color.RED);
		}
	}
}

export enum TweenableProperties{
	posX = "positionX",
	posY = "positionY",
	scaleX = "scaleX",
	scaleY = "scaleY",
	rotation = "rotation",
	alpha = "alpha"
}