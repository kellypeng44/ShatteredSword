import Vec2 from "../../DataTypes/Vec2";
import Scene from "../Scene";
import ParallaxLayer from "./ParallaxLayer";

export default class UILayer extends ParallaxLayer {
	constructor(scene: Scene, name: string){
		super(scene, name, Vec2.ZERO);
	}
}