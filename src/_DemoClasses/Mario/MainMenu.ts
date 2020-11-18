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

    startScene(): void {
        this.addUILayer("Main");

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

        let slider = <Slider>this.add.uiElement(UIElementType.SLIDER, "Main", {position: new Vec2(size.x, size.y*1.5)});
        let label = this.add.uiElement(UIElementType.LABEL, "Main", {position: new Vec2(size.x + 150, size.y*1.5), text: ""});
        slider.onValueChange = (value) => (<Label>label).setText(value.toString());
        this.add.uiElement(UIElementType.TEXT_INPUT, "Main", {position: new Vec2(size.x, size.y*1.7)});
    }

    updateScene(): void {
        Debug.log("mp", InputReceiver.getInstance().getMousePosition().toString());
    }
}

