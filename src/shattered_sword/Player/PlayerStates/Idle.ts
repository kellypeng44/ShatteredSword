import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";
import PlayerState from "./PlayerState";

export default class Idle extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
	}

	
	update(deltaT: number): void {
		
        //("idle anim");
		if (!PlayerState.dashTimer.isStopped()) {
			//console.log("Playing dash");
			this.owner.animation.playIfNotAlready("DASH");
		}
		else {
        	this.owner.animation.playIfNotAlready("IDLE", true);
		}

		let dir = this.getInputDirection();

		if(!dir.isZero() && dir.y === 0){
			this.finished(PlayerStates.WALK);
		}
		
		this.parent.velocity.x = 0;
		super.update(deltaT);
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}