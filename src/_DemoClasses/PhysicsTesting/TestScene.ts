import AABB from "../../DataTypes/Shapes/AABB";
import { TiledTilemapData } from "../../DataTypes/Tilesets/TiledData";
import Vec2 from "../../DataTypes/Vec2";
import Debug from "../../Debug/Debug";
import InputHandler from "../../Input/InputHandler";
import InputReceiver from "../../Input/InputReceiver";
import CanvasNode from "../../Nodes/CanvasNode";
import { GraphicType } from "../../Nodes/Graphics/GraphicTypes";
import TestPhysicsManager from "../../Physics/TestPhysicsManager";
import Scene from "../../Scene/Scene";
import Color from "../../Utils/Color";

export default class TestScene extends Scene {

	loadScene(){
		this.load.tilemap("test", "assets/tilemaps/PhysicsTest.json");
	}

	startScene(){
		// Opt into a custom physics manager
		this.physicsManager = new TestPhysicsManager();

		let tilemap = <CanvasNode>this.add.tilemap("test")[0].getItems()[0];

		let layer = this.getLayer("MovingObject");
		layer.getItems().forEach(item => {
			let timer = 0;
			let dir = new Vec2(-1, 0);
			item.update = (deltaT: number) => {
				if(timer > 2){
					timer = 0;
					dir.scale(-1);
				}
			
				item.move(dir.scaled(100*deltaT));
			
				timer += deltaT;
			}
		})

		this.addLayer("main");

		let player = this.add.graphic(GraphicType.RECT, "main", {position: new Vec2(50, 100), size: new Vec2(45, 45)});
		player.color = Color.ORANGE;
		player.addPhysics(new AABB(new Vec2(0, 0), new Vec2(15, 15)), new Vec2(0, 7.5));

		player.update = (deltaT: number) => {
			const input = InputReceiver.getInstance()

			let xDir = (input.isPressed("a") ? -1 : 0) + (input.isPressed("d") ? 1 : 0);
			let yDir = input.isJustPressed("space") ? -1 : 0;

			let dir = new Vec2(xDir * 300 * deltaT, yDir*1000 * deltaT);

			// Gravity
			if(dir.y === 0){
				dir.y = player.getLastVelocity().y + 50 * deltaT;
			}

			Debug.log("pvel", player.getLastVelocity());

			if(!dir.isZero()){
				player.move(dir);
			}
		}

		player.isPlayer = true;
	}
}