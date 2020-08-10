import GameNode from "./GameNode";
import Vec2 from "../DataTypes/Vec2";

export default abstract class CanvasNode extends GameNode{
	protected size: Vec2;

	constructor(){
		super();
		this.size = new Vec2(0, 0);
	}

	getSize(): Vec2 {
		return this.size;
	}

	contains(x: number, y: number): boolean {
		if(this.position.x < x && this.position.x + this.size.x > x){
			if(this.position.y < y && this.position.y + this.size.y > y){
				return true;
			}
		}
		return false;
	}
}