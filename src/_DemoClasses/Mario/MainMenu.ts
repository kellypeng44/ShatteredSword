import Vec2 from "../../DataTypes/Vec2";
import Debug from "../../Debug/Debug";
import InputHandler from "../../Input/InputHandler";
import InputReceiver from "../../Input/InputReceiver";
import { GraphicType } from "../../Nodes/Graphics/GraphicTypes";
import Button from "../../Nodes/UIElements/Button";
import { UIElementType } from "../../Nodes/UIElements/UIElementTypes";
import Scene from "../../Scene/Scene";
import Color from "../../Utils/Color";

export default class MainMenu extends Scene {

    playBtn: Button;

    loadScene(): void {

    }

    startScene(): void {
        this.addUILayer("Main");

        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, "Main", {position: new Vec2(size.x, size.y), text: "Play Game"});
        this.playBtn.setBackgroundColor(Color.GREEN);
        this.playBtn.setPadding(new Vec2(50, 10));
        this.playBtn.onClick = () => {
            console.log("Play");
        }
    }

    updateScene(): void {
        Debug.log("mp", InputReceiver.getInstance().getMousePosition().toString());
    }
}

