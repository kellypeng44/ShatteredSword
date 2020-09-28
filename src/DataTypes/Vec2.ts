/**
 * A two-dimensional vector (x, y)
 */
export default class Vec2 {

	// Store x and y in an array
	private vec: Float32Array;

	/**	
	 * When this vector changes its value, do something
	 */
	private onChange: Function;

	constructor(x: number = 0, y: number = 0) {
		this.vec = new Float32Array(2);
		this.vec[0] = x;
		this.vec[1] = y;
	}

	// Expose x and y with getters and setters
	get x() {
		return this.vec[0];
	}

	set x(x: number) {
		this.vec[0] = x;

		if(this.onChange){
			this.onChange();
		}
	}

	get y() {
		return this.vec[1];
	}

	set y(y: number) {
		this.vec[1] = y;

		if(this.onChange){
			this.onChange();
		}
	}

	static get ZERO() {
		return new Vec2(0, 0);
	}

	static get UP() {
		return new Vec2(0, -1);
	}

	/**
	 * The squared magnitude of the vector
	 */
	magSq(): number {
		return this.x*this.x + this.y*this.y;
	}

	/**
	 * The magnitude of the vector
	 */
	mag(): number {
		return Math.sqrt(this.magSq());
	}

	/**
	 * Returns this vector as a unit vector - Equivalent to dividing x and y by the magnitude
	 */
	normalize(): Vec2 {
		if(this.x === 0 && this.y === 0) return this;
		let mag = this.mag();
		this.x /= mag;
		this.y /= mag;
		return this;
	}

	/**
	 * Sets the vector's x and y based on the angle provided. Goes counter clockwise.
	 * @param angle The angle in radians
	 */
	setToAngle(angle: number): Vec2 {
		this.x = Math.cos(angle);
		this.y = Math.sin(angle);
		return this;
	}

	/**
	 * Returns a vector that point from this vector to another one
	 * @param other 
	 */
	vecTo(other: Vec2): Vec2 {
		return new Vec2(other.x - this.x, other.y - this.y);
	}

	/**
	 * Keeps the vector's direction, but sets its magnitude to be the provided magnitude
	 * @param magnitude 
	 */
	scaleTo(magnitude: number): Vec2 {
		return this.normalize().scale(magnitude);
	}

	/**
	 * Scales x and y by the number provided, or if two number are provided, scales them individually.
	 * @param factor 
	 * @param yFactor 
	 */
	scale(factor: number, yFactor: number = null): Vec2 {
		if(yFactor !== null){
			this.x *= factor;
			this.y *= yFactor;
			return this;
		}
		this.x *= factor;
		this.y *= factor;
		return this;
	}

	/**
	 * Returns a scaled version of this vector without modifying it.
	 * @param factor 
	 * @param yFactor 
	 */
	scaled(factor: number, yFactor: number = null): Vec2 {
		return this.clone().scale(factor, yFactor);
	}

	/**
	 * Rotates the vector counter-clockwise by the angle amount specified
	 * @param angle The angle to rotate by in radians
	 */
	rotateCCW(angle: number): Vec2 {
		let cs = Math.cos(angle);
		let sn = Math.sin(angle);
		let tempX = this.x*cs - this.y*sn;
		let tempY = this.x*sn + this.y*cs;
		this.x = tempX;
		this.y = tempY;
		return this;
	}

	/**
	 * Sets the vectors coordinates to be the ones provided
	 * @param x 
	 * @param y 
	 */
	set(x: number, y: number): Vec2 {
		this.x = x;
		this.y = y;
		return this;
	}

	/**
	 * Adds this vector the another vector
	 * @param other 
	 */
	add(other: Vec2): Vec2 {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	/**
	 * Subtracts another vector from this vector
	 * @param other 
	 */
	sub(other: Vec2): Vec2 {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	/**
	 * Multiplies this vector with another vector element-wise
	 * @param other 
	 */
	mult(other: Vec2): Vec2 {
		this.x *= other.x;
		this.y *= other.y;
		return this;
	}

	/**
	 * Returns the squared distance between this vector and another vector
	 * @param other 
	 */
	distanceSqTo(other: Vec2): number {
		return (this.x - other.x)*(this.x - other.x) + (this.y - other.y)*(this.y - other.y);
	}

	/**
	 * Returns a string representation of this vector rounded to 1 decimal point
	 */
	toString(): string {
		return this.toFixed();
	}

	/**
	 * Returns a string representation of this vector rounded to the specified number of decimal points
	 * @param numDecimalPoints 
	 */
	toFixed(numDecimalPoints: number = 1): string {
		return "(" + this.x.toFixed(numDecimalPoints) + ", " + this.y.toFixed(numDecimalPoints) + ")";
	}

	/**
	 * Returns a new vector with the same coordinates as this one.
	 */
	clone(): Vec2 {
		return new Vec2(this.x, this.y);
	}
	
	/**
	 * Sets the function that is called whenever this vector is changed.
	 * @param f The function to be called
	 */
	setOnChange(f: Function): void {
		this.onChange = f;
	}
}