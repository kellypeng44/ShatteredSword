import { CustomGameEventType } from "../../../CustomGameEventType";
import OnGround from "./OnGround";
import { PlayerStates } from "./PlayerController";

export default class Run extends OnGround {
	onEnter(): void {
		this.owner.speed = this.owner.MAX_SPEED;
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

		this.owner.velocity.x = dir.x * this.owner.speed

		this.emitter.fireEvent(CustomGameEventType.PLAYER_MOVE, {position: this.owner.position.clone()});
		this.owner.move(this.owner.velocity.scaled(deltaT));
	}
}