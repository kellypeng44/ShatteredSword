import Vec2 from "../../DataTypes/Vec2";
import Debug from "../../Debug/Debug";
import InputReceiver from "../../Input/InputReceiver";
import Button from "../../Nodes/UIElements/Button";
import Label from "../../Nodes/UIElements/Label";
import Slider from "../../Nodes/UIElements/Slider";
import { UIElementType } from "../../Nodes/UIElements/UIElementTypes";
import Scene from "../../Scene/Scene";
import Color from "../../Utils/Color";
import Level1 from "./Level1";

export default class MainMenu extends Scene {

    loadScene(): void {
        this.load.spritesheet("walker", "assets/spritesheets/walking.json");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("Sprite");

        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        let playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y), text: "Play Game"});
        playBtn.setBackgroundColor(Color.GREEN);
        playBtn.setPadding(new Vec2(50, 10));
        playBtn.onClick = () => {
            let sceneOptions = {
                physics: {
                    physicsLayerNames: ["ground", "player", "enemy", "coin"],
                    numPhyiscsLayers: 4,
                    physicsLayerCollisions:
                    [
                        [0, 1, 1, 1],
                        [1, 0, 0, 1],
                        [1, 0, 0, 1],
                        [1, 1, 1, 0]
                    ]
                }
            }
            this.sceneManager.changeScene(Level1, sceneOptions);
        }

        let animatedSprite = this.add.animatedSprite("walker", "Sprite");
        animatedSprite.position.set(100, 100);
        animatedSprite.scale.set(4, 4);
        animatedSprite.animation.play("JUMP");
        animatedSprite.animation.queue("WALK", true);
    }

    updateScene(): void {
        Debug.log("mp", InputReceiver.getInstance().getMousePosition().toString());
    }
}

