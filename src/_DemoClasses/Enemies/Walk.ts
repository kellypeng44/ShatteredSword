import Vec2 from "../../DataTypes/Vec2";
import OnGround from "./OnGround";

export default class Walk extends OnGround {
	onEnter(): void {
		if(this.owner.direction.isZero()){
			this.owner.direction = new Vec2(-1, 0);
		}
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.isOnWall()){
			// Flip around
			this.owner.direction.x *= -1;
		}

		this.owner.velocity.x = this.owner.direction.x * this.owner.speed;

		this.owner.move(this.owner.velocity.scaled(deltaT));
	}
}