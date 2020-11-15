import Vec2 from "../../DataTypes/Vec2";
import { GoombaStates } from "./GoombaController";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	time: number;
	
	onEnter(): void {
		if(this.parent.direction.isZero()){
			this.parent.direction = new Vec2(-1, 0);
		}

		this.time = Date.now();
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onWall){
			// Flip around
			this.parent.direction.x *= -1;
		}

		if(this.parent.jumpy && (Date.now() - this.time > 500)){
			console.log("Jump");
			this.finished(GoombaStates.JUMP);
			this.parent.velocity.y = -2000;
		}

		this.parent.velocity.x = this.parent.direction.x * this.parent.speed;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}
}