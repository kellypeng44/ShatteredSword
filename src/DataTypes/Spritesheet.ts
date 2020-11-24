import { AnimationData } from "../Rendering/Animations/AnimationTypes";

export default class Spritesheet {
    name: string;
    spriteSheetImage: string;
    spriteWidth: number;
    spriteHeight: number;
    columns: number;
    rows: number;
    animations: Array<AnimationData>;
}