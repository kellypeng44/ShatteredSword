import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import InputWrapper from "../Tools/InputWrapper";
import MainMenu from "./MainMenu";

export default class GameOver extends Scene {

    startScene() {
        const center = this.viewport.getCenter();

        this.addUILayer("primary");

        const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: "YOU DIED"});
        gameOver.textColor = Color.RED;
        gameOver.fontSize = 100;

        const hint = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y + 100), text: "Click to go back to Main Menu"});
        hint.textColor = Color.WHITE;
    }

    updateScene(){
        if(InputWrapper.isLeftMouseJustPressed()){
            this.sceneManager.changeToScene(MainMenu);
        }
    }
}