import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { EaseFunctionType } from "../../../Wolfie2D/Utils/EaseFunctions";
import { Player_Events } from "../../sword_enums";
import { PlayerStates } from "../PlayerController";
import InAir from "./InAir";
import Input from "../../../Wolfie2D/Input/Input";

export default class Jump extends InAir {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "jump", loop: false, holdReference: false});
	}

	

	update(deltaT: number): void {
		super.update(deltaT);

        this.owner.animation.play("JUMP", true);

		if(this.owner.onCeiling){
			this.parent.velocity.y = 0;
		}

		//TODO - testing doublejump, may have to move to InAir instead
		// If we jump, move to the Jump state, give a burst of upwards velocity
		if( this.parent.airjumps>0 && Input.isJustPressed("jump")){
			this.parent.airjumps --;
			this.finished("jump");
			this.parent.velocity.y = -600;	// basically jump height
			
		} 

		// If we're falling, go to the fall state
		if(this.parent.velocity.y >= 0){
			this.finished(PlayerStates.FALL);
		}
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}