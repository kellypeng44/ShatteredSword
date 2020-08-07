import GameNode from "./GameNode";
import Vec2 from "../DataTypes/Vec2";

export default class Player extends GameNode{
	velocity: Vec2;
	speed: number;

	constructor(){
		super();
		this.velocity = new Vec2(0, 0);
		this.speed = 300;
		this.size = new Vec2(50, 50);
	};

	update(deltaT: number): void {
		let dir = new Vec2(0, 0);
		dir.x += this.input.isPressed('a') ? -1 : 0;
		dir.x += this.input.isPressed('d') ? 1 : 0;
		dir.y += this.input.isPressed('s') ? 1 : 0;
		dir.y += this.input.isPressed('w') ? -1 : 0;

		dir.normalize();

		this.velocity = dir.scale(this.speed);
		this.position = this.position.add(this.velocity.scale(deltaT));
	}

	render(ctx: CanvasRenderingContext2D, viewportOrigin: Vec2, viewportSize: Vec2){
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(this.position.x - viewportOrigin.x, this.position.y - viewportOrigin.y, this.size.x, this.size.y);
	}
}