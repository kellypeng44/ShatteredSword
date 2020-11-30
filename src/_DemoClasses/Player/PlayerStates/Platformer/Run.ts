import AnimatedSprite from "../../../../Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../../../Utils/MathUtils";
import { CustomGameEventType } from "../../../CustomGameEventType";
import OnGround from "./OnGround";
import { PlayerStates } from "./PlayerController";

export default class Run extends OnGround {
	owner: AnimatedSprite;

	onEnter(): void {
		this.parent.speed = this.parent.MAX_SPEED;
		this.owner.animation.play("WALK", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} else {
			if(!this.input.isPressed("shift")){
				this.finished(PlayerStates.WALK);
			}
		}

		this.parent.velocity.x = dir.x * this.parent.speed

		this.emitter.fireEvent(CustomGameEventType.PLAYER_MOVE, {position: this.owner.position.clone()});
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): void {
		this.owner.animation.stop();
	}
}