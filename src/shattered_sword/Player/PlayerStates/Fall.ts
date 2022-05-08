import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import InAir from "./InAir";
import InputWrapper from "../../Tools/InputWrapper";
import PlayerState from "./PlayerState";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { GameState } from "../../sword_enums";

export default class Fall extends InAir {
    owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		// this.owner.animation.play("FALL", true);
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
				this.owner.animation.playIfNotAlready("FALL", true);
			}
		}
		if( this.parent.airjumps>0 && InputWrapper.isJumpJustPressed()){
			this.parent.airjumps --;
			this.finished("jump");
		} 
		super.update(deltaT);
    }
    onExit(): Record<string, any> {
		this.owner.animation.stop();
        return {};
    }
}