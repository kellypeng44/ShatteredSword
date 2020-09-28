import GameNode from "./GameNode";
import Vec2 from "../DataTypes/Vec2";
import { Region } from "../DataTypes/Interfaces/Descriptors";
import AABB from "../DataTypes/AABB";

/**
 * The representation of an object in the game world that can be drawn to the screen
 */
export default abstract class CanvasNode extends GameNode implements Region {
	private _size: Vec2;
	private _scale: Vec2;
	private boundary: AABB;

	constructor(){
		super();
		this._size = new Vec2(0, 0);
		this._size.setOnChange(this.sizeChanged);
		this._scale = new Vec2(1, 1);
		this._scale.setOnChange(this.scaleChanged);
		this.boundary = new AABB();
		this.updateBoundary();
	}

	get size(): Vec2 {
		return this._size;
	}

	set size(size: Vec2){
		this._size = size;
		this._size.setOnChange(this.sizeChanged);
		this.sizeChanged();
	}

	get scale(): Vec2 {
		return this._scale;
	}

	set scale(scale: Vec2){
		this._scale = scale;
		this._scale.setOnChange(this.sizeChanged);
		this.scaleChanged();
	}

	getSize(): Vec2 {
		return this.size.clone();
	}

	setSize(vecOrX: Vec2 | number, y: number = null): void {
		if(vecOrX instanceof Vec2){
			this.size.set(vecOrX.x, vecOrX.y);
		} else {
			this.size.set(vecOrX, y);
		}
	}

	/**
     * Returns the scale of the sprite
     */
    getScale(): Vec2 {
        return this.scale.clone();
    }

    /**
     * Sets the scale of the sprite to the value provided
     * @param scale 
     */
    setScale(scale: Vec2): void {
		this.scale = scale;
    }

	positionChanged = (): void => {
		this.updateBoundary();
	}

	sizeChanged = (): void => {
		this.updateBoundary();
	}

	scaleChanged = (): void => {
		this.updateBoundary();
	}

	private updateBoundary(): void {
		this.boundary.setCenter(this.position.clone());
		this.boundary.setHalfSize(this.size.clone().mult(this.scale).scale(1/2));
	}

	getBoundary(): AABB {
		return this.boundary;
	}

	/**
	 * Returns true if the point (x, y) is inside of this canvas object
	 * @param x 
	 * @param y 
	 */
	contains(x: number, y: number): boolean {
		return this.boundary.containsPoint(new Vec2(x, y));
	}

	abstract render(ctx: CanvasRenderingContext2D): void;
}