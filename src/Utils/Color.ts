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

	lighten(): Color {
		return new Color(MathUtils.clamp(this.r + 40, 0, 255), MathUtils.clamp(this.g + 40, 0, 255), MathUtils.clamp(this.b + 40, 0, 255), this.a);
	}

	darken(): Color {
		return new Color(MathUtils.clamp(this.r - 40, 0, 255), MathUtils.clamp(this.g - 40, 0, 255), MathUtils.clamp(this.b - 40, 0, 255), this.a);
	}
	
	toString(): string {
		return "#" + MathUtils.toHex(this.r, 2) + MathUtils.toHex(this.g, 2) + MathUtils.toHex(this.b, 2);
	}

	toStringRGB(): string {
		return "rgb(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ")";
	}

	toStringRGBA(): string {
		if(this.a === null){
			return this.toStringRGB();
		}
		return "rgba(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ", " + this.a.toString() +")"
	}
}