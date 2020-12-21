import MathUtils from "../Utils/MathUtils";

/**
 * A two-dimensional vector (x, y)
 */
export default class Vec2 {

	// Store x and y in an array
	private vec: Float32Array;

	/**	
	 * When this vector changes its value, do something
	 */
	private onChange: Function = () => {};

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

	static readonly ZERO_STATIC = new Vec2(0, 0);

	static get INF() {
		return new Vec2(Infinity, Infinity);
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
	 * Returns a new vector that is the normalized version of this one
	 */
	normalized(){
		let mag = this.mag();
		return new Vec2(this.x/mag, this.y/mag);
	}

	/**
	 * Sets the x and y elements of this vector to zero
	 */
	zero(){
		return this.set(0, 0);
	}

	/**
	 * Sets the vector's x and y based on the angle provided. Goes counter clockwise.
	 * @param angle The angle in radians
	 * @param radius The magnitude of the vector at the specified angle
	 */
	setToAngle(angle: number, radius: number = 1): Vec2 {
		this.x = MathUtils.floorToPlace(Math.cos(angle)*radius, 5);
		this.y = MathUtils.floorToPlace(-Math.sin(angle)*radius, 5);
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
	 * Returns a vector containing the direction from this vector to another
	 * @param other 
	 */
	dirTo(other: Vec2): Vec2 {
		return this.vecTo(other).normalize();
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
	 * Copies the values of the other Vec2 into this one.
	 * @param other The Vec2 to copy
	 */
	copy(other: Vec2): Vec2 {
		return this.set(other.x, other.y);
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
	 * Divides this vector with another vector element-wise
	 * @param other 
	 */
	div(other: Vec2): Vec2 {
		if(other.x === 0 || other.y === 0) throw "Divide by zero error";
		this.x /= other.x;
		this.y /= other.y;
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
	 * Returns the distance between this vector and another vector
	 * @param other 
	 */
	distanceTo(other: Vec2): number {
		return Math.sqrt(this.distanceSqTo(other));
	}

	/**
	 * Returns the dot product of this vector and another
	 * @param other 
	 */
	dot(other: Vec2): number {
		return this.x*other.x + this.y*other.y;
	}

	/**
	 * Returns the angle counter-clockwise in radians from this vector to another vector
	 * @param other 
	 */
	angleToCCW(other: Vec2): number {
		let dot = this.dot(other);
		let det = this.x*other.y - this.y*other.x;
		let angle = -Math.atan2(det, dot);

		if(angle < 0){
			angle += 2*Math.PI;
		}

		return angle;
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
	 * Returns true if this vector and other have the EXACT same x and y (not assured to be safe for floats)
	 * @param other The vector to check against
	 */
	strictEquals(other: Vec2): boolean {
		return this.x === other.x && this.y === other.y;
	}

	/**
	 * Returns true if this vector and other have the same x and y
	 * @param other The vector to check against
	 */
	equals(other: Vec2): boolean {
		let xEq = Math.abs(this.x - other.x) < 0.0000001;
		let yEq = Math.abs(this.y - other.y) < 0.0000001;

		return xEq && yEq;
	}

	/**
	 * Returns true if this vector is the zero vector exactly (not assured to be safe for floats).
	 */
	strictIsZero(): boolean {
		return this.x === 0 && this.y === 0;
	}

	/**
	 * Returns true if this x and y for this vector are both zero.
	 */
	isZero(): boolean {
		return Math.abs(this.x) < 0.0000001 && Math.abs(this.y) < 0.0000001;
	}
	
	/**
	 * Sets the function that is called whenever this vector is changed.
	 * @param f The function to be called
	 */
	setOnChange(f: Function): void {
		this.onChange = f;
	}
	
	getOnChange(): string {
		return this.onChange.toString();
	}

	static lerp(a: Vec2, b: Vec2, t: number): Vec2 {
		return new Vec2(MathUtils.lerp(a.x, b.x, t), MathUtils.lerp(a.y, b.y, t));
	}
}