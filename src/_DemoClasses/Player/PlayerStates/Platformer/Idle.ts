import AnimatedSprite from "../../../../Nodes/Sprites/AnimatedSprite";
import OnGround from "./OnGround";
import { PlayerStates } from "./PlayerController";
import PlayerState from "./PlayerState";

export default class Idle extends OnGround {
	owner: AnimatedSprite;

	onEnter(): void {
		this.parent.speed = this.parent.MIN_SPEED;
		this.owner.animation.play("IDLE", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(!dir.isZero() && dir.y === 0){
			if(this.input.isPressed("shift")){
				this.finished(PlayerStates.RUN);
			} else {
				this.finished(PlayerStates.WALK);
			}
		}
		
		this.parent.velocity.x = 0;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): void {
		this.owner.animation.stop();
	}
}