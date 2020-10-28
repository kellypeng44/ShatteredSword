import InputReceiver from "../Input/InputReceiver";
import Vec2 from "../DataTypes/Vec2";
import Receiver from "../Events/Receiver";
import Emitter from "../Events/Emitter";
import Scene from "../Scene/Scene";
import Layer from "../Scene/Layer";
import { Physical, Positioned, isRegion, Unique, Updateable, Region } from "../DataTypes/Interfaces/Descriptors"
import Shape from "../DataTypes/Shapes/Shape";
import GameEvent from "../Events/GameEvent";
import Map from "../DataTypes/Map";
import AABB from "../DataTypes/Shapes/AABB";
import Debug from "../Debug/Debug";

/**
 * The representation of an object in the game world
 */
export default abstract class GameNode implements Positioned, Unique, Updateable, Physical {
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
	isStatic: boolean;
	isCollidable: boolean;
	isTrigger: boolean;
	group: string;
	triggers: Map<string>;
	_velocity: Vec2;
	sweptRect: AABB;
	isPlayer: boolean;

	protected input: InputReceiver;
	protected receiver: Receiver;
	protected emitter: Emitter;
	protected scene: Scene;
	protected layer: Layer;
	

	constructor(){
		this.input = InputReceiver.getInstance();
		this._position = new Vec2(0, 0);
		this._position.setOnChange(this.positionChanged);
		this.receiver = new Receiver();
		this.emitter = new Emitter();
	}

	/*---------- POSITIONED ----------*/
	get position(): Vec2 {
		return this._position;
	}

	set position(pos: Vec2) {
		this._position = pos;
		this._position.setOnChange(this.positionChanged);
		this.positionChanged();
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
	/**
     * @param velocity The velocity with which to move the object.
     */
	move = (velocity: Vec2): void => {
		this.moving = true;
		this._velocity = velocity;
	};

    /**
     * @param velocity The velocity with which the object will move.
     */
	finishMove = (): void => {
		this.moving = false;
		this.position.add(this._velocity);
	}

	/**
	 * @param collisionShape The collider for this object. If this has a region (implements Region),
	 * it will be used when no collision shape is specified (or if collision shape is null).
	 * @param isCollidable Whether this is collidable or not. True by default.
	 * @param isStatic Whether this is static or not. False by default
	 */
	addPhysics = (collisionShape?: Shape, isCollidable: boolean = true, isStatic: boolean = false): void => {
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

		if(collisionShape){
			this.collisionShape = collisionShape;
		} else if (isRegion(this)) {
			// If the gamenode has a region and no other is specified, use that
			this.collisionShape = (<any>this).boundary.clone();
		} else {
			throw "No collision shape specified for physics object."
		}

		this.sweptRect = this.collisionShape.getBoundingRect();
		this.scene.getPhysicsManager().registerObject(this);
	}

	/**
	 * @param group The name of the group that will activate the trigger
	 * @param eventType The type of this event to send when this trigger is activated
	 */
    addTrigger = (group: string, eventType: string): void => {
		this.isTrigger = true;
		this.triggers.add(group, eventType);
	};

	/*---------- GAME NODE ----------*/
	/**
	 * Sets the scene for this object.
	 * @param scene The scene this object belongs to.
	 */
	setScene(scene: Scene): void {
		this.scene = scene;
	}

	/** Gets the scene this object is in. */
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

	/** Returns the layer this object is on. */
	getLayer(): Layer {
		return this.layer;
	}

	/**
	 * Called if the position vector is modified or replaced
	 */
	// TODO - For some reason this isn't recognized in the child class
	protected positionChanged = (): void => {
		if(this.hasPhysics){
			this.collisionShape.center = this.position;
		}
	};

	// TODO - This doesn't seem ideal. Is there a better way to do this?
	getViewportOriginWithParallax(): Vec2 {
		return this.scene.getViewport().getOrigin().mult(this.layer.getParallax());
	}

	getViewportScale(): number {
		return this.scene.getViewport().getZoomLevel();
	}

	abstract update(deltaT: number): void;
}