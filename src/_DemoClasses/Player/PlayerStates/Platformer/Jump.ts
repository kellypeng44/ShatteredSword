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

		if(this.owner.onGround){
			this.finished(PlayerStates.PREVIOUS);
		}

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}
		
		let dir = this.getInputDirection();

		this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;

		this.emitter.fireEvent(CustomGameEventType.PLAYER_MOVE, {position: this.owner.position.clone()});
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): void {}
}