import AI from "../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Debug from "../Wolfie2D/Debug/Debug";
import Emitter from "../Wolfie2D/Events/Emitter";
import GameEvent from "../Wolfie2D/Events/GameEvent";
import Input from "../Wolfie2D/Input/Input";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../Wolfie2D/Utils/MathUtils";
import { Homework1Event } from "./HW1_Enums";

export default class SpaceshipPlayerController implements AI {
	// We want to be able to control our owner, so keep track of them
	private owner: AnimatedSprite;

	// The direction the spaceship is moving
	private direction: Vec2;
	private MIN_SPEED: number = 0;
	private MAX_SPEED: number = 300;
	private speed: number;
	private ACCELERATION: number = 4;
	private rotationSpeed: number;

	// An emitter to hook into the event queue
	private emitter: Emitter;

	initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
		this.owner = owner;

		// Start facing up
		this.direction = new Vec2(0, 1);
		this.speed = 0;
		this.rotationSpeed = 2;

		this.emitter = new Emitter();
	}

	handleEvent(event: GameEvent): void {
		// We need to handle animations when we get hurt
		if(event.type === Homework1Event.PLAYER_DAMAGE){
			this.owner.animation.play("shield");
		}
	}

	update(deltaT: number): void {
		// We need to handle player input
		let forwardAxis = (Input.isPressed('forward') ? 1 : 0) + (Input.isPressed('backward') ? -1 : 0);
		let turnDirection = (Input.isPressed('turn_ccw') ? -1 : 0) + (Input.isPressed('turn_cw') ? 1 : 0);

		// Space controls - speed stays the same if nothing happens
		// Forward to speed up, backward to slow down
		this.speed += this.ACCELERATION * forwardAxis;
		this.speed = MathUtils.clamp(this.speed, this.MIN_SPEED, this.MAX_SPEED);

		// Rotate the player
		this.direction.rotateCCW(turnDirection * this.rotationSpeed * deltaT);

		// Update the visual direction of the player
		this.owner.rotation = -(Math.atan2(this.direction.y, this.direction.x) - Math.PI/2);
		
		// Move the player with physics
		this.owner.move(this.direction.scaled(-this.speed * deltaT));
	
		// If the player clicked, we need to spawn in a fleet member
		if(Input.isMouseJustPressed()){
			this.emitter.fireEvent(Homework1Event.SPAWN_FLEET, {position: Input.getGlobalMousePosition()});
		}

		// Animations
		if(!this.owner.animation.isPlaying("shield")){
			if(this.speed > 0){
				this.owner.animation.playIfNotAlready("boost");
			} else {
				this.owner.animation.playIfNotAlready("idle");
			}
		}
	}
} 