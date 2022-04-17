import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { Player_Events } from "../../sword_enums";
import InputWrapper from "../../Tools/InputWrapper";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
	}


	update(deltaT: number): void {
		super.update(deltaT);
		//console.log("walking anim");
        this.owner.animation.playIfNotAlready("WALK", true);

		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} 
		
		this.parent.velocity.x = dir.x * (this.parent.speed + this.parent.CURRENT_BUFFS.speed);
		
		//TODO - decide how to implement dash - could be a flash - maybe allow in air as well
		if(InputWrapper.isDashJustPressed()){
			//play dash anim maybe
			//TODO - might give buffed speed stat to dash speed
			this.parent.velocity.x = dir.x * 1000; //give sidewards velocity
			//TODO - give player i frame
		}
		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}