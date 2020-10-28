import Scene from "../../Scene/Scene";
import Rect from "../../Nodes/Graphics/Rect";
import Vec2 from "../../DataTypes/Vec2";
import Color from "../../Utils/Color";
import PlayerController from "../Player/PlayerStates/Platformer/PlayerController";
import { PlayerStates } from "../Player/PlayerStates/Platformer/PlayerController";
import GoombaController from "../Enemies/GoombaController";
import InputReceiver from "../../Input/InputReceiver";

export default class MarioClone extends Scene {

	loadScene(): void {
		this.load.tilemap("level", "assets/tilemaps/MarioClone.json");
		this.load.image("goomba", "assets/sprites/Goomba.png");
	}

	startScene(): void {
		let layer = this.addLayer();
		this.add.tilemap("level", new Vec2(2, 2));

		let player = this.add.graphic(Rect, layer, new Vec2(0, 0), new Vec2(64, 64));
		player.setColor(Color.BLUE);
		player.addPhysics();
		player.isPlayer = true;
		this.viewport.follow(player);
		this.viewport.setBounds(0, 0, 5120, 1280);

		let ai = new PlayerController(player);
		ai.initialize(PlayerStates.IDLE);
		player.update = (deltaT: number) => {ai.update(deltaT)};

		player.addTrigger("CoinBlock", "playerHitCoinBlock");

		for(let xPos of [14, 20, 25, 30, 33, 37, 49, 55, 58, 70, 74]){
			let goomba = this.add.sprite("goomba", layer);
			let ai = new GoombaController(goomba, false);
			ai.initialize("idle");
			goomba.update = (deltaT: number) => {ai.update(deltaT)};
			goomba.position.set(64*xPos, 0);
			goomba.scale.set(2, 2);
			goomba.addPhysics();
		}
	}

}