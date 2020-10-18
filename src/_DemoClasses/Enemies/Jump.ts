import GameEvent from "../../Events/GameEvent";
import { GoombaStates } from "./GoombaController";
import GoombaState from "./GoombaState";

export default class Jump extends GoombaState {

	onEnter(): void {}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.isGrounded()){
			this.finished(GoombaStates.PREVIOUS);
		}

		if(this.owner.isOnCeiling()){
			this.owner.velocity.y = 0;
		}

		this.owner.velocity.x += this.owner.direction.x * this.owner.speed/3.5 - 0.3*this.owner.velocity.x;

		this.owner.move(this.owner.velocity.scaled(deltaT));
	}

	onExit(): void {}
}