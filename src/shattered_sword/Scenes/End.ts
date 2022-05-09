import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import RandomMapGenerator from "../Tools/RandomMapGenerator";
import GameLevel from "./GameLevel";
import InputWrapper from "../Tools/InputWrapper";
import Forest from "./Forest";
import GameFinish from "./GameFinish";

export default class End extends GameLevel {
    loadScene(): void {
        super.loadScene();
        this.rmg = new RandomMapGenerator("shattered_sword_assets/jsons/castle_template.json", InputWrapper.randomSeed);
        this.map = this.rmg.getMap();
        this.load.tilemapFromObject("map", this.map);

        //load enemies
        this.load.spritesheet("Snake","shattered_sword_assets/spritesheets/Snake.json");
        this.load.spritesheet("black_pudding","shattered_sword_assets/spritesheets/black_pudding.json");
        this.load.spritesheet("FinalBoss","shattered_sword_assets/spritesheets/FinalBoss.json");
        
    }

    startScene(): void {
        super.startScene();
        this.addCheckPoint(new Vec2(3, 13), new Vec2(10, 10), "startStory", "nextLevel");
    }

    protected goToNextLevel(): void {
        this.viewport.setZoomLevel(1);
        this.sceneManager.changeToScene(GameFinish);
    }

    protected playStartStory(): void {
        if (!this.touchedStartCheckPoint) {
            this.touchedStartCheckPoint = true;
            this.storyLoader("shattered_sword_assets/jsons/level1story.json");
            this.startTimer();
        }
    }
}