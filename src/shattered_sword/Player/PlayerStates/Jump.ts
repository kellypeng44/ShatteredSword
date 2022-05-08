import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { Player_Events } from "../../sword_enums";
import InputWrapper from "../../Tools/InputWrapper";
import { PlayerStates } from "../PlayerController";
import InAir from "./InAir";
import PlayerState from "./PlayerState";
import { GameState } from "../../sword_enums";
import Timer from "../../../Wolfie2D/Timing/Timer";
export default class Jump extends InAir {
	owner: AnimatedSprite;
	jumpTimer: Timer;

	onEnter(options: Record<string, any>): void {
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
		this.jumpTimer = new Timer(300);
		this.jumpTimer.start();
		this.parent.velocity.y = -400;
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
				this.owner.animation.playIfNotAlready("JUMP", true);
			}
		}

		
		if (!this.jumpTimer.isStopped() && !this.jumpTimer.isPaused() && InputWrapper.isJumpPressed()) {
			this.parent.velocity.y = -400;
		}
		else {
			this.jumpTimer.pause();
		}

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}
		// If we're falling, go to the fall state
		if(this.parent.velocity.y >= 0){
			this.finished(PlayerStates.FALL);
		}
		super.update(deltaT);
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}