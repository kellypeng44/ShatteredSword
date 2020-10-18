import AABB from "../../DataTypes/AABB";
import Vec2 from "../../DataTypes/Vec2";
import Sprite from "../../Nodes/Sprites/Sprite";
import Collider from "../../Physics/Colliders/Collider";
import PhysicsNode from "../../Physics/PhysicsNode";
import GoombaController, { GoombaStates } from "../Enemies/GoombaController";

export default class Goomba extends PhysicsNode {
	controller: GoombaController;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	direction: Vec2 = Vec2.ZERO;

	constructor(position: Vec2, canJump: boolean){
		super();
		this.position.copy(position);
		this.velocity = Vec2.ZERO;
		this.controller = new GoombaController(this, canJump);
		this.controller.initialize(GoombaStates.IDLE);
		this.collider = new Collider(new AABB(position, new Vec2(32, 32)))
	}

	create(): void {

	}

	update(deltaT: number): void {
		this.controller.update(deltaT);
	}
}