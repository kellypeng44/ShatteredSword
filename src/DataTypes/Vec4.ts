import Vec2 from "./Vec2";

export default class Vec4{

	public x : number;
	public y : number;
	public z : number;
	public w : number;

    constructor(x : number = 0, y : number = 0, z : number = 0, w : number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    split() : [Vec2, Vec2] {
        return [new Vec2(this.x, this.y), new Vec2(this.z, this.w)];
    }
}