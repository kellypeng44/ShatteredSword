import GameEvent from "../../Events/GameEvent";
import { GoombaStates } from "./GoombaController";
import GoombaState from "./GoombaState";

export default class OnGround extends GoombaState {
	onEnter(): void {}

	handleInput(event: GameEvent): void {
		super.handleInput(event);
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