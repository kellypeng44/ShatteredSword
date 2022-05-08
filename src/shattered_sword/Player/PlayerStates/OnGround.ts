import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Game from "../../../Wolfie2D/Loop/Game";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { GameState } from "../../sword_enums";
import InputWrapper from "../../Tools/InputWrapper";
import PlayerState from "./PlayerState";

export default class OnGround extends PlayerState {
	onEnter(options: Record<string, any>): void {}

	update(deltaT: number): void {
		//reset airjumps
		this.parent.airjumps = this.parent.MAX_airjumps;

		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}


		

		let direction = this.getInputDirection();

		if(direction.x !== 0){
			(<Sprite>this.owner).invertX = MathUtils.sign(direction.x) < 0;
		}

	
		// If we jump, move to the Jump state, give a burst of upwards velocity
		if(InputWrapper.isJumpJustPressed()){
			this.finished("jump");
			
		} 
		else if(!this.owner.onGround && InputWrapper.getState() === GameState.GAMING){
			this.finished("fall");
		}
		super.update(deltaT);
		
	}

	onExit(): Record<string, any> {
		return {};
	}
}