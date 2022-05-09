import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Player_Events } from "../../sword_enums";
import InputWrapper from "../../Tools/InputWrapper";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";
import PlayerState from "./PlayerState";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { GameState } from "../../sword_enums";
import GameLevel from "../../Scenes/GameLevel";

export default class Walk extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
        
	}


	update(deltaT: number): void {
		if (!PlayerState.dashTimer.isStopped()) {
			if(InputWrapper.getState() === GameState.GAMING){
				this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "dash", loop: false, holdReference: false});
			}
			this.owner.animation.playIfNotAlready("DASH");
		}
		else {
			if (this.parent.invincible) {
				this.owner.animation.playIfNotAlready("HURT");
			}
			else {
				this.owner.animation.playIfNotAlready("WALK", true);
			}
		}
		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} 
		
		if (GameLevel.currentLevel === "snow") {
			this.parent.velocity.x += dir.x * 5;
			if (this.parent.velocity.x > this.parent.speed)
				this.parent.velocity.x = this.parent.speed;
			if (this.parent.velocity.x < -1 * this.parent.speed)
				this.parent.velocity.x = -1 * this.parent.speed;
		}
		else {
			this.parent.velocity.x = dir.x * (this.parent.speed );
		}
		super.update(deltaT);
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}