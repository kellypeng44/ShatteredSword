import GameNode from "./GameNode";
import Vec2 from "../DataTypes/Vec2";
import { Region, Renderable } from "../DataTypes/Interfaces/Descriptors";
import AABB from "../DataTypes/Shapes/AABB";

/**
 * The representation of an object in the game world that can be drawn to the screen
 */
export default abstract class CanvasNode extends GameNode implements Region {
	private _size: Vec2;
	private _scale: Vec2;
	private _boundary: AABB;

	visible = true;

	constructor(){
		super();
		this._size = new Vec2(0, 0);
		this._size.setOnChange(() => this.sizeChanged());
		this._scale = new Vec2(1, 1);
		this._scale.setOnChange(() => this.scaleChanged());
		this._boundary = new AABB();
		this.updateBoundary();
	}

	get size(): Vec2 {
		return this._size;
	}

	set size(size: Vec2){
		this._size = size;
		// Enter as a lambda to bind "this"
		this._size.setOnChange(() => this.sizeChanged());
		this.sizeChanged();
	}

	get scale(): Vec2 {
		return this._scale;
	}

	set scale(scale: Vec2){
		this._scale = scale;
		// Enter as a lambda to bind "this"
		this._scale.setOnChange(() => this.scaleChanged());
		this.scaleChanged();
	}

	protected positionChanged(): void {
		super.positionChanged();
		this.updateBoundary();
	}

	protected sizeChanged(): void {
		this.updateBoundary();
	}

	protected scaleChanged(): void {
		this.updateBoundary();
	}

	private updateBoundary(): void {
		this._boundary.center.set(this.position.x, this.position.y);
		this._boundary.halfSize.set(this.size.x*this.scale.x/2, this.size.y*this.scale.y/2);
	}

	get boundary(): AABB {
		return this._boundary;
	}

	/**
	 * Returns true if the point (x, y) is inside of this canvas object
	 * @param x 
	 * @param y 
	 */
	contains(x: number, y: number): boolean {
		return this._boundary.containsPoint(new Vec2(x, y));
	}
}