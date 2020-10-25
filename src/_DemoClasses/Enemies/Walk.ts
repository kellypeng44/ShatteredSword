import Vec2 from "../../DataTypes/Vec2";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	onEnter(): void {
		if(this.parent.direction.isZero()){
			this.parent.direction = new Vec2(-1, 0);
		}
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onWall){
			// Flip around
			this.parent.direction.x *= -1;
		}

		this.parent.velocity.x = this.parent.direction.x * this.parent.speed;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}
}