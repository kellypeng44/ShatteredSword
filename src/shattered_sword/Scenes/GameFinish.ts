import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import { GameState } from "../sword_enums";
import InputWrapper from "../Tools/InputWrapper";
import GameLevel from "./GameLevel";
import MainMenu from "./MainMenu";

export default class GameFinish extends Scene {

    startScene() {
        InputWrapper.setState(GameState.PAUSE);
        InputWrapper.randomSeed = undefined;
        const center = this.viewport.getCenter();

        this.addUILayer("primary");

        const congra = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: "CONGRATULATIONS!"});
        congra.textColor = Color.GREEN;
        congra.fontSize = 100;

        const time = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y + 100), text: ("You finished the game in " + GameLevel.gameTimeToString())});
        time.textColor = Color.WHITE;

        const hint = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y + 200), text: "Click to go back to Main Menu"});
        hint.textColor = Color.WHITE;
    }

    updateScene(){
        if(InputWrapper.isLeftMouseJustPressed()){
            this.sceneManager.changeToScene(MainMenu);
        }
    }
}