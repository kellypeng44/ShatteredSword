import GameEvent from "../../../../Events/GameEvent";
import { CustomGameEventType } from "../../../CustomGameEventType";
import PlayerState from "./PlayerState";

export default class OnGround extends PlayerState {
	onEnter(): void {}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);

		if(this.input.isJustPressed("w") || this.input.isJustPressed("space")){
			this.finished("jump");
			this.parent.velocity.y = -2000;
			this.emitter.fireEvent(CustomGameEventType.PLAYER_JUMP)
		} else if(!this.owner.onGround){
			this.finished("jump");
		}
	}

	onExit(): void {}
}