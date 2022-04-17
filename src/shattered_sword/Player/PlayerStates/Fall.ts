import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import InAir from "./InAir";
import InputWrapper from "../../Tools/InputWrapper";

export default class Fall extends InAir {
    owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.owner.animation.play("FALL", true);
	}

    update(deltaT: number): void {
        super.update(deltaT);
        
		//TODO - testing doublejump, may have to move to InAir instead
		// If we jump, move to the Jump state, give a burst of upwards velocity
		if( this.parent.airjumps>0 && InputWrapper.isJumpJustPressed()){
			this.parent.airjumps --;
			this.finished("jump");
			this.parent.velocity.y = -600;	// basically jump height
			
		} 
    }
    onExit(): Record<string, any> {
		this.owner.animation.stop();
        return {};
    }
}