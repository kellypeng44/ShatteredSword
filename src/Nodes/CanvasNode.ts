import GameNode from "./GameNode";
import Vec2 from "../DataTypes/Vec2";

/**
 * The representation of an object in the game world that can be drawn to the screen
 */
export default abstract class CanvasNode extends GameNode{
	protected size: Vec2;

	constructor(){
		super();
		this.size = new Vec2(0, 0);
	}

	getSize(): Vec2 {
		return this.size;
	}

	setSize(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.size.set(vecOrX.x, vecOrX.y);
		} else {
			this.size.set(vecOrX, y);
		}
	}

	/**
	 * Returns true if the point (x, y) is inside of this canvas object
	 * @param x 
	 * @param y 
	 */
	contains(x: number, y: number): boolean {
		if(this.position.x < x && this.position.x + this.size.x > x){
			if(this.position.y < y && this.position.y + this.size.y > y){
				return true;
			}
		}
		return false;
	}

	abstract render(ctx: CanvasRenderingContext2D): void;
}