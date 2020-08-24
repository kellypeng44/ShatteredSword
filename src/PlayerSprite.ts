import CanvasNode from "./Nodes/CanvasNode";
import Vec2 from "./DataTypes/Vec2";
import Debug from "./Debug/Debug";

export default class Player extends CanvasNode{
	debug: Debug;

	constructor(){
		super();
	};

	update(deltaT: number): void {}

	render(ctx: CanvasRenderingContext2D, origin: Vec2){
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(this.position.x - origin.x, this.position.y - origin.y, this.size.x, this.size.y);
	}
}