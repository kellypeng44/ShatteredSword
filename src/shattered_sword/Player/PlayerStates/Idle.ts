import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameLevel from "../../Scenes/GameLevel";
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
			console.log("Playing dash");
			this.owner.animation.playIfNotAlready("DASH");
		}
		else {
        	this.owner.animation.playIfNotAlready("IDLE", true);
		}

		let dir = this.getInputDirection();

		if(!dir.isZero() && dir.y === 0){
			this.finished(PlayerStates.WALK);
		}
		
		if (GameLevel.currentLevel === "snow") {
			this.parent.velocity.x = Math.sign(this.parent.velocity.x)*(Math.abs(this.parent.velocity.x) - 5 < 0 ? 0 : Math.abs(this.parent.velocity.x) - 5);
		}
		else {
			this.parent.velocity.x = 0;
		}
		super.update(deltaT);
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}