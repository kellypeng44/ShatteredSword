import AABB from "../../DataTypes/AABB";
import Vec2 from "../../DataTypes/Vec2";
import Debug from "../../Debug/Debug";
import Collider from "../../Physics/Colliders/Collider";
import PhysicsNode from "../../Physics/PhysicsNode";
import PlayerController from "../Player/PlayerStates/Platformer/PlayerController";
import { PlayerStates } from "../Player/PlayerStates/Platformer/PlayerController";

export default class Player extends PhysicsNode {
	protected controller: PlayerController
	velocity: Vec2;
	speed: number = 400;
	MIN_SPEED: number = 400;
	MAX_SPEED: number = 1000;

	constructor(position: Vec2){
		super();
		this.position.copy(position);
		this.velocity = Vec2.ZERO;
		this.controller = new PlayerController(this);
		this.controller.initialize(PlayerStates.IDLE);
		this.collider = new Collider(new AABB(Vec2.ZERO, new Vec2(32, 32)))
	}

	create(): void {

	}

	update(deltaT: number): void {
		this.controller.update(deltaT);
		Debug.log("playerVel", "Pos: " + this.position.toString() + ", Vel: " + this.velocity.toString())
	}
}