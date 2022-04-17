import { TiledTilemapData } from "../../Wolfie2D/DataTypes/Tilesets/TiledData";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import RandomMapGenerator from "../Tools/RandomMapGenerator";
import GameLevel from "./GameLevel";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Color from "../../Wolfie2D/Utils/Color";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import { Statuses } from "../sword_enums";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import EnemyAI from "../AI/EnemyAI";
import BattlerAI from "../AI/BattlerAI";

export default class Tutorial extends GameLevel {
    private map: TiledTilemapData;
    private rmg: RandomMapGenerator;


    loadScene(): void {
        super.loadScene();
        // Load resources
        // this.load.tilemap("forest1", "shattered_sword_assets/tilemaps/Tutorial.json");
        // let map = localStorage.getItem("map");
        this.randomSeed = Math.floor(Math.random() * 10000000000);
        this.rmg = new RandomMapGenerator("shattered_sword_assets/jsons/forest_template.json", this.randomSeed);
        this.map = this.rmg.getMap();
        this.load.tilemapFromObject("forest1", this.map);

        this.load.spritesheet("player", "shattered_sword_assets/spritesheets/Hiro.json")

        // TODO - change when done testing
        this.load.spritesheet("slice", "shattered_sword_assets/spritesheets/slice.json");

        //load enemies
        this.load.spritesheet("snake","shattered_sword_assets/spritesheets/Snake.json");
        this.load.spritesheet("tiger","shattered_sword_assets/spritesheets/Tiger.json");



        //load music here
    }

    startScene(): void {


        // Add the level 1 tilemap
        this.add.tilemap("forest1", new Vec2(2, 2));
        console.log("width,height:" + this.map.width, this.map.height);
        this.viewport.setBounds(0, 0, this.map.width * 32, this.map.height * 32);
        this.viewport.follow(this.player);

        this.playerSpawn = this.rmg.getPlayer().scale(32);
        console.log(this.playerSpawn)


        // Do generic setup for a GameLevel
        super.startScene();

        let enemies = this.rmg.getEnemies();
        /*
        for (let enemy of enemies) {
            switch (enemy.type) {
                case "test_dummy":
                    this.addEnemy("test_dummy", enemy.position.scale(32), {
                        player: this.player,
                        health: 100,
                        tilemap: "Main",
                        //actions:actions,
                        goal: Statuses.REACHED_GOAL,
                    })
                    break;

                default:
                    break;
            }
        }
        */

        //may have to move this to start scene in gameLevel
        this.initializeEnemies(enemies);
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }

}