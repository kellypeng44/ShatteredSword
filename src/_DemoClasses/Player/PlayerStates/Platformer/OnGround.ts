import GameEvent from "../../../../Events/GameEvent";
import Sprite from "../../../../Nodes/Sprites/Sprite";
import MathUtils from "../../../../Utils/MathUtils";
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

		let direction = this.getInputDirection();

		if(direction.x !== 0){
			(<Sprite>this.owner).invertX = MathUtils.sign(direction.x) < 0;
		}

		if(this.input.isJustPressed("w") || this.input.isJustPressed("space")){
			this.finished("jump");
			this.parent.velocity.y = -500;
			if(this.parent.velocity.x !== 0){
				this.owner.tweens.play("flip");
			}
			this.emitter.fireEvent(CustomGameEventType.PLAYER_JUMP)
		} else if(!this.owner.onGround){
			this.finished("jump");
		}
	}

	onExit(): void {}
}