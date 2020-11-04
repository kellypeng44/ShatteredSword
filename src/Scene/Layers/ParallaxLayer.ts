import Layer from "../Layer";
import Vec2 from "../../DataTypes/Vec2";
import Scene from "../Scene";

export default class ParallaxLayer extends Layer {
	parallax: Vec2;
	
	constructor(scene: Scene, name: string, parallax: Vec2){
		super(scene, name);
		this.parallax = parallax;
	}
}