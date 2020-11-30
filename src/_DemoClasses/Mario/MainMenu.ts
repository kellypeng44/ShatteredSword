import Vec2 from "../../DataTypes/Vec2";
import Debug from "../../Debug/Debug";
import InputReceiver from "../../Input/InputReceiver";
import AnimatedSprite from "../../Nodes/Sprites/AnimatedSprite";
import Button from "../../Nodes/UIElements/Button";
import { UIElementType } from "../../Nodes/UIElements/UIElementTypes";
import Scene from "../../Scene/Scene";
import Color from "../../Utils/Color";
import { EaseFunctionType } from "../../Utils/EaseFunctions";
import Level1 from "./Level1";

export default class MainMenu extends Scene {

    animatedSprite: AnimatedSprite;

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

        animatedSprite.tweens.add("wiggle", {
            startDelay: 0,
            duration: 300,
            effects: [{
                property: "rotation",
                start: -0.1,
                end: 0.1,
                ease: EaseFunctionType.IN_OUT_SINE
            }],
            reverseOnComplete: true,
            loop: true
        });

        animatedSprite.tweens.play("wiggle");

        animatedSprite.tweens.add("scale", {
            startDelay: 0,
            duration: 1000,
            effects: [{
                property: "scaleX",
                start: 4,
                end: 6,
                ease: EaseFunctionType.IN_OUT_SINE
            },
            {
                property: "scaleY",
                start: 4,
                end: 6,
                ease: EaseFunctionType.IN_OUT_SINE
            }],
            reverseOnComplete: true,
            loop: true
        });

        animatedSprite.tweens.play("scale");

        this.animatedSprite = animatedSprite;
    }

    updateScene(): void {
        Debug.log("mp", InputReceiver.getInstance().getMousePosition().toString());
    }
}

