import Vec2 from "./Wolfie2D/DataTypes/Vec2";
import { GraphicType } from "./Wolfie2D/Nodes/Graphics/GraphicTypes";
import Point from "./Wolfie2D/Nodes/Graphics/Point";
import Rect from "./Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "./Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "./Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "./Wolfie2D/Scene/Scene";
import Color from "./Wolfie2D/Utils/Color";

export default class WebGLScene extends Scene {

	private point: Point;
	private rect: Rect;
	private player: AnimatedSprite;
	private t: number = 0;

	loadScene() {
		this.load.spritesheet("player", "hw1_assets/spritesheets/player_spaceship.json");
	}

	startScene() {
		this.addLayer("primary");

		this.point = this.add.graphic(GraphicType.POINT, "primary", {position: new Vec2(100, 100), size: new Vec2(10, 10)})
		this.point.color = Color.CYAN;
		console.log(this.point.color.toStringRGBA());

		this.rect = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(300, 100), size: new Vec2(100, 50)});
		this.rect.color = Color.ORANGE;

		this.player = this.add.animatedSprite("player", "primary");
		this.player.position.set(800, 500);
		this.player.scale.set(0.5, 0.5);
		this.player.animation.play("idle");
	}

	updateScene(deltaT: number) {
		this.t += deltaT;

		let s = Math.sin(this.t);
		let c = Math.cos(this.t);

		this.point.position.x = 100 + 100*c;
		this.point.position.y = 100 + 100*s;

		this.rect.rotation = this.t;
	}
}