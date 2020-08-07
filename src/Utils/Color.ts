import MathUtils from "./MathUtils";

export default class Color{
	public r: number;
	public g: number;
	public b: number;
	public a: number;

	constructor(r: number = 0, g: number = 0, b: number = 0, a: number = null){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
	}
	
	toString(): string{
		return "#" + MathUtils.toHex(this.r, 2) + MathUtils.toHex(this.g, 2) + MathUtils.toHex(this.b, 2);
	}

	toStringRGB(){
		return "rgb(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ")";
	}

	toStringRGBA(){
		if(this.a === null){
			throw "No alpha value assigned to color";
		}
		return "rgb(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ", " + this.a.toString() +")"
	}
}