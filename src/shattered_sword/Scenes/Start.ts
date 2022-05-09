import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import RandomMapGenerator from "../Tools/RandomMapGenerator";
import GameLevel from "./GameLevel";
import InputWrapper from "../Tools/InputWrapper";
import Forest from "./Forest";

export default class Start extends GameLevel {
    loadScene(): void {
        super.loadScene();
        this.rmg = new RandomMapGenerator("shattered_sword_assets/jsons/castle_template.json", InputWrapper.randomSeed);
        this.map = this.rmg.getMap();
        this.load.tilemapFromObject("map", this.map);

        //load enemies
    }

    startScene(): void {
        super.startScene();
        this.addCheckPoint(new Vec2(3, 13), new Vec2(10, 10), "endStory", "nextLevel");
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
        this.sceneManager.changeToScene(Forest, {}, sceneOptions);
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