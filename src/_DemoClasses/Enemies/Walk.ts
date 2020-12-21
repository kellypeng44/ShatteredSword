import Vec2 from "../../DataTypes/Vec2";
import AnimatedSprite from "../../Nodes/Sprites/AnimatedSprite";
import { GoombaStates } from "./GoombaController";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	time: number;
	
	onEnter(): void {
		if(this.parent.direction.isZero()){
			this.parent.direction = new Vec2(-1, 0);
			(<AnimatedSprite>this.owner).invertX = true;
		}

		(<AnimatedSprite>this.owner).animation.play("WALK", true);

		this.time = Date.now();
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onWall){
			// Flip around
			this.parent.direction.x *= -1;
			(<AnimatedSprite>this.owner).invertX = !(<AnimatedSprite>this.owner).invertX;
		}

		if(this.parent.jumpy && (Date.now() - this.time > 500)){
			this.finished(GoombaStates.JUMP);
			this.parent.velocity.y = -300;
		}

		this.parent.velocity.x = this.parent.direction.x * this.parent.speed;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): void {
		(<AnimatedSprite>this.owner).animation.stop();

	}
}