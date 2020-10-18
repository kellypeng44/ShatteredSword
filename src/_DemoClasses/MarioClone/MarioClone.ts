import Scene from "../../Scene/Scene";
import Rect from "../../Nodes/Graphics/Rect";
import Vec2 from "../../DataTypes/Vec2";
import Player from "./Player";
import Color from "../../Utils/Color";
import Goomba from "./Goomba";

export default class MarioClone extends Scene {

	loadScene(): void {
		this.load.tilemap("level", "assets/tilemaps/MarioClone.json");
		this.load.image("goomba", "assets/sprites/Goomba.png");
	}

	startScene(): void {
		let layer = this.addLayer();
		this.add.tilemap("level", new Vec2(2, 2));

		let player = this.add.physics(Player, layer, new Vec2(0, 0));
		let playerSprite = this.add.graphic(Rect, layer, new Vec2(0, 0), new Vec2(64, 64));
		playerSprite.setColor(Color.BLUE);
		player.addChild(playerSprite);
		this.viewport.follow(playerSprite);
		this.viewport.setBounds(0, 0, 5120, 1280);

		for(let xPos of [14, 20, 25, 30, 33, 37, 49, 55, 58, 70, 74]){
			let goomba = this.add.physics(Goomba, layer, new Vec2(64*xPos, 0), true);
			let goombaSprite = this.add.sprite("goomba", layer);
			goombaSprite.setPosition(64*xPos, 0);
			goombaSprite.setScale(new Vec2(2, 2));
			goomba.addChild(goombaSprite);
		}
	}

}