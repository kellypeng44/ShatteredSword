import Scene from "../../Scene/Scene";
import Vec2 from "../../DataTypes/Vec2";
import PlayerController from "../Player/PlayerController";
import { GraphicType } from "../../Nodes/Graphics/GraphicTypes";
import { UIElementType } from "../../Nodes/UIElements/UIElementTypes";
import Color from "../../Utils/Color";
import PathfinderController from "./Pathfinder/PathfinderController";

export default class PathfindingScene extends Scene {

	loadScene(){
		this.load.tilemap("interior", "/assets/tilemaps/Interior.json");
	}

	startScene(){
		this.add.tilemap("interior");
		
		// Add a layer for the game objects
		this.addLayer("main");

		// Add the player
		let player = this.add.graphic(GraphicType.RECT, "main", {position: new Vec2(500, 500), size: new Vec2(64, 64)});
		player.addPhysics();
		player.addAI(PlayerController, {playerType: "topdown", speed: 400});

		// Set the viewport to follow the player
		this.viewport.setBounds(0, 0, 40*64, 40*64);
		this.viewport.follow(player);
		this.viewport.enableZoom();

		// Add a navigator
		let nav = this.add.graphic(GraphicType.RECT, "main", {position: new Vec2(700, 400), size: new Vec2(64, 64)});
		nav.setColor(Color.BLUE);
		nav.addPhysics();
		nav.addAI(PathfinderController, {player: player});

		// Add a layer for the ui
		this.addUILayer("uiLayer");

		// Add a button that triggers the navigator
		let btn = this.add.uiElement(UIElementType.BUTTON, "uiLayer", {position: new Vec2(400, 20), text: "Navigate"});
		btn.size = new Vec2(120, 35);
		btn.setBackgroundColor(Color.BLUE);
		btn.onClickEventId = "navigate";
	}
}