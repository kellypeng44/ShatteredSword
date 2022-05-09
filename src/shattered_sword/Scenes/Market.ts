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
import InputWrapper from "../Tools/InputWrapper";
import End from "./End";

export default class Market extends GameLevel {
    loadScene(): void {
        super.loadScene();
        this.rmg = new RandomMapGenerator("shattered_sword_assets/jsons/market_template.json", InputWrapper.randomSeed);
        this.map = this.rmg.getMap();
        console.log(this.map);
        this.load.tilemapFromObject("map", this.map);

        //load enemies

        //can load enemy sprite here
        //sprites obtained from cse380 sprite wesbite
        // this.load.spritesheet("black_pudding","shattered_sword_assets/spritesheets/black_pudding.json");
        this.load.spritesheet("Assassin","shattered_sword_assets/spritesheets/Assassin.json");
        //load music here
    }
    protected goToNextLevel(): void {
        this.viewport.setZoomLevel(1);
        let sceneOptions = {
            physics: {
                groupNames: ["ground", "player", "enemies"],
                collisions:
                [
                    [0, 1, 1],
                    [1, 0, 0],
                    [1, 0, 0]
                ]
            }
        }
        this.sceneManager.changeToScene(End, {}, sceneOptions);
    }

    protected playStartStory(): void {
        if (!this.touchedStartCheckPoint) {
            this.touchedStartCheckPoint = true;
            this.storyLoader("shattered_sword_assets/jsons/level5story.json");
            this.startTimer();
        }
    }

    protected playEndStory() {
        if (!this.touchedEndCheckPoint) {
            this.touchedEndCheckPoint = true;
            this.storyLoader("shattered_sword_assets/jsons/story.json");
            this.endTimer();
            this.levelEnded = true;
        }
    }
}