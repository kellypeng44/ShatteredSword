import GameEvent from "../../Events/GameEvent";
import MathUtils from "../../Utils/MathUtils";
import { CustomGameEventType } from "../CustomGameEventType";
import { GoombaStates } from "./GoombaController";
import OnGround from "./OnGround";

export default class Afraid extends OnGround {

	onEnter(): void {}

	handleInput(event: GameEvent): void {
		if(event.type === CustomGameEventType.PLAYER_MOVE){
			let pos = event.data.get("position");
			this.parent.direction.x = MathUtils.sign(this.owner.position.x - pos.x);
		} else if(event.type === "playerHitCoinBlock") {
			if(event.data.get("collision").firstContact.y < 1 && event.data.get("node").collisionShape.center.y > event.data.get("other").collisionShape.center.y){
				this.finished("previous");
			}
		}
	}

	update(deltaT: number): void {
		super.update(deltaT);

		this.parent.velocity.x = this.parent.direction.x * this.parent.speed * 1.2;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): void {}
}