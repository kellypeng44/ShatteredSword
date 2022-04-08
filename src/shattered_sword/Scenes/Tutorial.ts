import { TiledTilemapData } from "../../Wolfie2D/DataTypes/Tilesets/TiledData";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import RandomMapGenerator from "../Tools/RandomMapGenerator";
import GameLevel from "./GameLevel";



export default class Tutorial extends GameLevel{
    private map: TiledTilemapData;
    loadScene(): void {
        super.loadScene();
        // Load resources
        // this.load.tilemap("forest1", "shattered_sword_assets/tilemaps/Tutorial.json");
        // let map = localStorage.getItem("map");
        let rmg = new RandomMapGenerator("shattered_sword_assets/jsons/forest_template.json", 114514);
        this.map = rmg.getMap();
        this.load.tilemapFromObject("forest1", this.map);
        
        this.load.spritesheet("player", "shattered_sword_assets/spritesheets/Hiro.json")
        //load music here
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("forest1", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, this.map.width*32, this.map.height*32);

        this.playerSpawn = new Vec2(5*32, 9*32);

        // Do generic setup for a GameLevel
        super.startScene();

    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }

}