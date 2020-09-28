import MathUtils from "./MathUtils";
import Color from "./Color";
import Perlin from "./Rand/Perlin";

class Noise {
    p: Perlin = new Perlin();

    perlin(x: number, y: number, z?: number): number {
        return this.p.perlin(x, y, z);
    }
}

export default class RandUtils {
    /**
     * Generates a random integer in the specified range
     * @param min The min of the range (inclusive)
     * @param max The max of the range (exclusive)
     */
	static randInt(min: number, max: number): number {
        return Math.floor(Math.random()*(max - min) + min);
    }
    
    /**
     * Generates a random hexadecimal number in the specified range
     * @param min The min of the range (inclusive)
     * @param max The max of the range (exclusive)
     */
    static randHex(min: number, max: number): string {
        return MathUtils.toHex(RandUtils.randInt(min, max));
    }

    /**
     * Generates a random color
     */
	static randColor(): Color {
        let r = RandUtils.randInt(0, 256);
        let g = RandUtils.randInt(0, 256);
        let b = RandUtils.randInt(0, 256);
        return new Color(r, g, b);
    }

    static noise: Noise = new Noise();

}