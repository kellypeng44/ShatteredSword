import Vec2 from "../Vec2";
import AABB from "./AABB";
import Shape from "./Shape";

/**
 * A Circle
 */
export default class Circle extends Shape {
	private _center: Vec2;
	private radius: number;
	
	/**
	 * Creates a new Circle
	 * @param center The center of the circle
	 * @param radius The radius of the circle
	 */
	constructor(center: Vec2, radius: number) {
		super();
        this._center = center ? center : new Vec2(0, 0);
        this.radius = radius ? radius : 0;
	}

	get center(): Vec2 {
		return this._center;
	}

	set center(center: Vec2) {
		this._center = center;
	}

	get halfSize(): Vec2 {
		return new Vec2(this.radius, this.radius);
	}

	// @override
	getBoundingRect(): AABB {
		return new AABB(this._center.clone(), new Vec2(this.radius, this.radius));
	}

	// @override
	getBoundingCircle(): Circle {
		return this.clone();
	}

	// @override
	overlaps(other: Shape): boolean {
		throw new Error("Method not implemented.");
	}

	// @override
	clone(): Circle {
		return new Circle(this._center.clone(), this.radius);
	}
}