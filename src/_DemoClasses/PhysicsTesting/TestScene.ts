import Vec2 from "../../DataTypes/Vec2";
import InputHandler from "../../Input/InputHandler";
import InputReceiver from "../../Input/InputReceiver";
import { GraphicType } from "../../Nodes/Graphics/GraphicTypes";
import BasicPhysicsManager from "../../Physics/BasicPhysicsManager";
import Scene from "../../Scene/Scene";
import Color from "../../Utils/Color";

export default class TestScene extends Scene {

	startScene(){
		// Opt into a custom physics manager
		this.physicsManager = new BasicPhysicsManager(this.sceneOptions.physics);

		this.addLayer("main");

		let player = this.add.graphic(GraphicType.RECT, "main", {position: new Vec2(100, 100), size: new Vec2(100, 100)});
		player.addPhysics();

		player.update = (deltaT: number) => {
			const input = InputReceiver.getInstance()

			let xDir = (input.isPressed("a") ? -1 : 0) + (input.isPressed("d") ? 1 : 0);
			let yDir = (input.isPressed("w") ? -1 : 0) + (input.isPressed("s") ? 1 : 0);

			let dir = new Vec2(xDir, yDir);
			dir.normalize();

			if(!dir.isZero()){
				player.move(dir.scale(deltaT * 300));
			}
		}

		let block = this.add.graphic(GraphicType.RECT, "main", {position: new Vec2(300, 500), size: new Vec2(100, 100)});
		block.color = Color.CYAN;
		block.addPhysics(block.boundary, true, true);

		let movingBlock = this.add.graphic(GraphicType.RECT, "main", {position: new Vec2(500, 200), size: new Vec2(100, 100)});
		movingBlock.color = Color.CYAN;
		movingBlock.addPhysics();

		let timer = 0;
		let dir = new Vec2(1, 0);
		movingBlock.update = (deltaT: number) => {
			if(timer > 0.5){
				timer = 0;
				dir.scale(-1);
			}

			movingBlock.move(dir.scaled(200*deltaT));

			timer += deltaT;
		}
	}
}