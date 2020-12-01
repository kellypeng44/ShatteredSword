import Vec2 from "../../DataTypes/Vec2";
import GameEvent from "../../Events/GameEvent";
import AnimatedSprite from "../../Nodes/Sprites/AnimatedSprite";
import { CustomGameEventType } from "../CustomGameEventType";
import { GoombaStates } from "./GoombaController";
import OnGround from "./OnGround";

export default class Idle extends OnGround {
	onEnter(): void {
		this.parent.speed = this.parent.speed;
		(<AnimatedSprite>this.owner).animation.play("IDLE", true);
	}

	onExit(): void {
		(<AnimatedSprite>this.owner).animation.stop();
	}

	handleInput(event: GameEvent) {
		if(event.type === CustomGameEventType.PLAYER_MOVE){
			let pos = event.data.get("position");
			if(this.owner.position.x - pos.x < (64*10)){
				this.finished(GoombaStates.WALK);
			}
		}
	}

	update(deltaT: number): void {
		super.update(deltaT);
		
		this.parent.velocity.x = 0;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}
}