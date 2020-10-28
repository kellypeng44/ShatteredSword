import Scene from "../../Scene/Scene";
import Rect from "../../Nodes/Graphics/Rect";
import Vec2 from "../../DataTypes/Vec2";
import PlayerController from "../Player/PlayerController";

export default class PathfindingScene extends Scene {

	loadScene(){
		this.load.tilemap("interior", "/assets/tilemaps/Interior.json");
	}

	startScene(){
		this.add.tilemap("interior");
		
		let layer = this.addLayer();

		let player = this.add.graphic(Rect, layer, new Vec2(500, 500), new Vec2(64, 64));
		player.addPhysics();
		let ai = new PlayerController(player, "topdown");
		ai.speed = 400;
		player.update = (deltaT: number) => {ai.update(deltaT)}
		this.viewport.setBounds(0, 0, 40*64, 40*64);
		this.viewport.follow(player);
		this.viewport.enableZoom();
	}
}