import GameEvent from "../../Events/GameEvent";
import { CustomGameEventType } from "../CustomGameEventType";
import GoombaController, { GoombaStates } from "./GoombaController";
import GoombaState from "./GoombaState";

export default class OnGround extends GoombaState {
	onEnter(): void {}

	handleInput(event: GameEvent): void {
		if(event.type === CustomGameEventType.PLAYER_JUMP && (<GoombaController>this.parentStateMachine).jumpy){
			this.finished(GoombaStates.JUMP);
			this.owner.velocity.y = -2000;
		}
	}

	update(deltaT: number): void {
		if(this.owner.velocity.y > 0){
			this.owner.velocity.y = 0;
		}
		super.update(deltaT);

		if(!this.owner.isGrounded()){
			this.finished(GoombaStates.JUMP);
		}
	}

	onExit(): void {}
}