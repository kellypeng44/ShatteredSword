import CanvasNode from "./CanvasNode";
import Vec2 from "../DataTypes/Vec2";
import Debug from "../Debug/Debug";

export default class Player extends CanvasNode{
	velocity: Vec2;
	speed: number;
	debug: Debug;

	constructor(){
		super();
		this.velocity = new Vec2(0, 0);
		this.speed = 300;
		this.size = new Vec2(50, 50);
		this.debug = Debug.getInstance();
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

		this.debug.log("player", "Player Pos: " + this.position.toFixed());
	}

	render(ctx: CanvasRenderingContext2D, origin: Vec2){
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(this.position.x - origin.x, this.position.y - origin.y, this.size.x, this.size.y);
	}
}