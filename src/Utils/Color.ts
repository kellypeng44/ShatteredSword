import MathUtils from "./MathUtils";

// TODO: This should be moved to the datatypes folder
export default class Color {
	public r: number;
	public g: number;
	public b: number;
	public a: number;

	constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
	}

	static get TRANSPARENT(): Color {
		return new Color(0, 0, 0, 0);
	}
	
	static get RED(): Color {
		return new Color(255, 0, 0, 1);
	}

	static get GREEN(): Color {
		return new Color(0, 255, 0, 1);
	}

	static get BLUE(): Color {
		return new Color(0, 0, 255, 1);
	}

	static get YELLOW(): Color {
		return new Color(255, 255, 0, 1);
	}

	static get PURPLE(): Color {
		return new Color(255, 0, 255, 1);
	}
	static get CYAN(): Color {
		return new Color(0, 255, 255, 1);
	}

	static get WHITE(): Color {
		return new Color(255, 255, 255, 1);
	} 

	static get BLACK(): Color {
		return new Color(0, 0, 0, 1);
	}

	static get ORANGE(): Color {
		return new Color(255, 100, 0, 1);
	}

	/**
	 * Returns a new color slightly lighter than the current color
	 */
	lighten(): Color {
		return new Color(MathUtils.clamp(this.r + 40, 0, 255), MathUtils.clamp(this.g + 40, 0, 255), MathUtils.clamp(this.b + 40, 0, 255), this.a);
	}

	/**
	 * Returns a new color slightly darker than the current color
	 */
	darken(): Color {
		return new Color(MathUtils.clamp(this.r - 40, 0, 255), MathUtils.clamp(this.g - 40, 0, 255), MathUtils.clamp(this.b - 40, 0, 255), this.a);
	}
	
	/**
	 * Returns the color as a string of the form #RRGGBB
	 */
	toString(): string {
		return "#" + MathUtils.toHex(this.r, 2) + MathUtils.toHex(this.g, 2) + MathUtils.toHex(this.b, 2);
	}

	/**
	 * Returns the color as a string of the form rgb(r, g, b)
	 */
	toStringRGB(): string {
		return "rgb(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ")";
	}

	/**
	 * Returns the color as a string of the form rgba(r, g, b, a)
	 */
	toStringRGBA(): string {
		if(this.a === 0){
			return this.toStringRGB();
		}
		return "rgba(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ", " + this.a.toString() +")"
	}
}