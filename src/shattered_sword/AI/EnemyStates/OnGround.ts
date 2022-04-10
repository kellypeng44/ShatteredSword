import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import EnemyState from "./EnemyState";

export default class OnGround extends EnemyState {
	onEnter(options: Record<string, any>): void {}

	update(deltaT: number): void {
		if(this.parent.velocity.y > 0){
			this.parent.velocity.y = 0;
		}
		super.update(deltaT);

		
		this.finished("fall");
		
		
	}

	handleInput(event: GameEvent): void { }
	
	onExit(): Record<string, any> {
		return {};
	}
}