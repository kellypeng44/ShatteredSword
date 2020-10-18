import Vec2 from "../../../../DataTypes/Vec2";
import GameEvent from "../../../../Events/GameEvent";
import MathUtils from "../../../../Utils/MathUtils";
import { CustomGameEventType } from "../../../CustomGameEventType";
import { PlayerStates } from "./PlayerController";
import PlayerState from "./PlayerState";

export default class Jump extends PlayerState {

	onEnter(): void {}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.isGrounded()){
			this.finished(PlayerStates.PREVIOUS);
		}

		if(this.owner.isOnCeiling()){
			this.owner.velocity.y = 0;
		}
		
		let dir = this.getInputDirection();

		this.owner.velocity.x += dir.x * this.owner.speed/3.5 - 0.3*this.owner.velocity.x;

		this.emitter.fireEvent(CustomGameEventType.PLAYER_MOVE, {position: this.owner.position.clone()});
		this.owner.move(this.owner.velocity.scaled(deltaT));
	}

	onExit(): void {}
}