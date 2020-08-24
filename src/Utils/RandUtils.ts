import MathUtils from "./MathUtils";
import Color from "./Color";

export default class RandUtils{
	static randInt(min: number, max: number): number {
        return Math.floor(Math.random()*(max - min) + min);
    }
    
    static randHex(min: number, max: number): string {
        return MathUtils.toHex(RandUtils.randInt(min, max));
    }

	static randColor(): Color {
        let r = RandUtils.randInt(0, 256);
        let g = RandUtils.randInt(0, 256);
        let b = RandUtils.randInt(0, 256);
        return new Color(r, g, b);
    }
}