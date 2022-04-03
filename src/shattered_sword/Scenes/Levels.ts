
import Scene from "../../Wolfie2D/Scene/Scene";
import ConfigManager from "../Tools/ConfigManager";
import SaveManager from "../Tools/SaveManager";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Layer from "../../Wolfie2D/Scene/Layer";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MainMenu from "./MainMenu";
import SceneWithStory from "./SceneWithStory";


export default class Levels extends Scene {
    private primary: Layer;
    // TODO
    loadScene(){}
    startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.primary = this.addUILayer("primary");

        
        const level1 = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y - 150), text: "level 1"});
        level1.size.set(200, 50);
        level1.borderWidth = 2;
        level1.borderColor = Color.WHITE;
        level1.backgroundColor = Color.TRANSPARENT;
        level1.onClickEventId = "level1";

        const level2 = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y - 100), text: "level 2"});
        level2.size.set(200, 50);
        level2.borderWidth = 2;
        level2.borderColor = Color.WHITE;
        level2.backgroundColor = Color.TRANSPARENT;
        level2.onClickEventId = "level2";

        const level3 = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y - 50), text: "level 3"});
        level3.size.set(200, 50);
        level3.borderWidth = 2;
        level3.borderColor = Color.WHITE;
        level3.backgroundColor = Color.TRANSPARENT;
        level3.onClickEventId = "level3";

        const level4 = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y ), text: "level 4"});
        level4.size.set(200, 50);
        level4.borderWidth = 2;
        level4.borderColor = Color.WHITE;
        level4.backgroundColor = Color.TRANSPARENT;
        level4.onClickEventId = "level4";

        const level5 = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 50), text: "level 5"});
        level5.size.set(200, 50);
        level5.borderWidth = 2;
        level5.borderColor = Color.WHITE;
        level5.backgroundColor = Color.TRANSPARENT;
        level5.onClickEventId = "level5";

        const StorySceneTester = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 100), text: "StorySceneTester"});
        StorySceneTester.size.set(200, 50);
        StorySceneTester.borderWidth = 2;
        StorySceneTester.borderColor = Color.WHITE;
        StorySceneTester.backgroundColor = Color.TRANSPARENT;
        StorySceneTester.onClickEventId = "StorySceneTester";

        const back = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = "back";
        
        this.receiver.subscribe("level1");
        this.receiver.subscribe("level2");
        this.receiver.subscribe("level3");
        this.receiver.subscribe("level4");
        this.receiver.subscribe("level5");
        this.receiver.subscribe("StorySceneTester");
        this.receiver.subscribe("back");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "level1"){
                this.sceneManager.changeToScene(MainMenu, {});
            }

            if(event.type === "level2"){
                this.sceneManager.changeToScene(MainMenu, {});
            }

            if(event.type === "level3"){
                this.sceneManager.changeToScene(MainMenu, {});
            }

            if(event.type === "level4"){
                this.sceneManager.changeToScene(MainMenu, {});
            }

            if(event.type === "level5"){
                this.sceneManager.changeToScene(MainMenu, {});
            }

            if(event.type === "StorySceneTester"){
                this.sceneManager.changeToScene(SceneWithStory, {});
            }

            if(event.type === "back"){
                this.sceneManager.changeToScene(MainMenu, {});
            }

        
        }
    }

}