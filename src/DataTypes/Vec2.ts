export default class Vec2 {

	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	magSq(): number {
		return this.x*this.x + this.y*this.y;
	}

	mag(): number {
		return Math.sqrt(this.magSq());
	}

	normalize(): Vec2 {
		if(this.x === 0 && this.y === 0) return this;
		let mag = this.mag();
		this.x /= mag;
		this.y /= mag;
		return this;
	}

	setToAngle(angle: number): Vec2 {
		this.x = Math.cos(angle);
		this.y = Math.sin(angle);
		return this;
	}

	scaleTo(magnitude: number): Vec2 {
		return this.normalize().scale(magnitude);
	}

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

	rotate(angle: number): Vec2 {
		let cs = Math.cos(angle);
		let sn = Math.sin(angle);
		let tempX = this.x*cs - this.y*sn;
		let tempY = this.x*sn + this.y*cs;
		this.x = tempX;
		this.y = tempY;
		return this;
	}

	set(x: number, y: number): Vec2 {
		this.x = x;
		this.y = y;
		return this;
	}

	add(other: Vec2): Vec2 {
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	sub(other: Vec2): Vec2 {
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}

	toString(): string {
		return "(" + this.x + ", " + this.y + ")";
	}

	toFixed(): string {
		return "(" + this.x.toFixed(1) + ", " + this.y.toFixed(1) + ")";
	}
}