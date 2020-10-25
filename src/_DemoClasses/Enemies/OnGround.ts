import GameEvent from "../../Events/GameEvent";
import { CustomGameEventType } from "../CustomGameEventType";
import GoombaController, { GoombaStates } from "./GoombaController";
import GoombaState from "./GoombaState";

export default class OnGround extends GoombaState {
	onEnter(): void {}

	handleInput(event: GameEvent): void {
		if(event.type === CustomGameEventType.PLAYER_JUMP && (<GoombaController>this.parent).jumpy){
			this.finished(GoombaStates.JUMP);
			this.parent.velocity.y = -2000;
		}
	}

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);

		if(!this.owner.onGround){
			this.finished(GoombaStates.JUMP);
		}
	}

	onExit(): void {}
}