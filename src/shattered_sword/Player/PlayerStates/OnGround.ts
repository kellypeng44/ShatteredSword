import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import PlayerState from "./PlayerState";

export default class OnGround extends PlayerState {
	onEnter(options: Record<string, any>): void {}

	update(deltaT: number): void {
		//reset airjumps
		this.parent.airjumps = this.parent.MAX_airjumps;

		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}


		super.update(deltaT);

		let direction = this.getInputDirection();

		if(direction.x !== 0){
			(<Sprite>this.owner).invertX = MathUtils.sign(direction.x) < 0;
		}

	
		// If we jump, move to the Jump state, give a burst of upwards velocity
		if(Input.isJustPressed("jump")){
			this.finished("jump");
			this.parent.velocity.y = -600;	// basically jump height
			
		} 
		else if(!this.owner.onGround){
			this.finished("fall");
		}

		
	}

	onExit(): Record<string, any> {
		return {};
	}
}