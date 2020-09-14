import Vec2 from "./Vec2";

export default class Vec4{

	public vec: Float32Array;

    constructor(x : number = 0, y : number = 0, z : number = 0, w : number = 0) {
        this.vec = new Float32Array(4);
        this.vec[0] = x;
        this.vec[1] = y;
        this.vec[2] = z;
        this.vec[3] = w;
    }

    // Expose x and y with getters and setters
	get x() {
		return this.vec[0];
	}

	set x(x: number) {
		this.vec[0] = x;
	}

	get y() {
		return this.vec[1];
	}

	set y(y: number) {
		this.vec[1] = y;
    }

	get z() {
		return this.vec[2];
	}

	set z(x: number) {
		this.vec[2] = x;
	}

	get w() {
		return this.vec[3];
	}

	set w(y: number) {
		this.vec[3] = y;
	}

    split() : [Vec2, Vec2] {
        return [new Vec2(this.x, this.y), new Vec2(this.z, this.w)];
    }
}