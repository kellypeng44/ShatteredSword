import GameEvent from "../../Events/GameEvent";
import { GoombaStates } from "./GoombaController";
import GoombaState from "./GoombaState";

export default class Jump extends GoombaState {

	onEnter(): void {}

	handleInput(event: GameEvent): void {}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onGround){
			this.finished(GoombaStates.PREVIOUS);
		}

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		this.parent.velocity.x += this.parent.direction.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): void {}
}