import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import GameLevel from "./GameLevel";



export default class Tutorial extends GameLevel{

    loadScene(): void {
        // Load resources
        this.load.tilemap("forest1", "shattered_sword_assets/tilemaps/Tutorial.json");
        this.load.spritesheet("player", "shattered_sword_assets/spritesheets/Hiro.json")
        //load music here
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("forest1", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 20*32);

        this.playerSpawn = new Vec2(5*32, 9*32);

        // Do generic setup for a GameLevel
        super.startScene();

    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }

}