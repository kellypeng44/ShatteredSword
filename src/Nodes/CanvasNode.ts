import GameNode from "./GameNode";
import Vec2 from "../DataTypes/Vec2";
import Viewport from "../SceneGraph/Viewport";
import Scene from "../GameState/Scene";

export default abstract class CanvasNode extends GameNode{
	protected size: Vec2;
	protected scene: Scene;

	constructor(){
		super();
		this.size = new Vec2(0, 0);
	}

	init(scene: Scene){
		this.scene = scene;
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

	contains(x: number, y: number): boolean {
		if(this.position.x < x && this.position.x + this.size.x > x){
			if(this.position.y < y && this.position.y + this.size.y > y){
				return true;
			}
		}
		return false;
	}

	abstract render(ctx: CanvasRenderingContext2D, origin: Vec2): void;
}