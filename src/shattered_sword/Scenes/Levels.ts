
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
import Tutorial from "./Tutorial";
import Porcelain from "./Porcelain";
import Greatwall from './Greatwall';


export default class Levels extends Scene {
    private primary: Layer;
    // TODO
    loadScene(){}
    startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.primary = this.addUILayer("primary");

        
        const tutorial = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y - 100), text: "Start Game"});
        tutorial.size.set(200, 50);
        tutorial.borderWidth = 2;
        tutorial.borderColor = Color.WHITE;
        tutorial.backgroundColor = Color.TRANSPARENT;
        tutorial.onClickEventId = "start";

        const porcelain = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y), text: "porcelain(Test)"});
        porcelain.size.set(200, 50);
        porcelain.borderWidth = 2;
        porcelain.borderColor = Color.WHITE;
        porcelain.backgroundColor = Color.TRANSPARENT;
        porcelain.onClickEventId = "porcelain";

        const greatwall = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 100), text: "greatwall(Test)"});
        greatwall.size.set(200, 50);
        greatwall.borderWidth = 2;
        greatwall.borderColor = Color.WHITE;
        greatwall.backgroundColor = Color.TRANSPARENT;
        greatwall.onClickEventId = "greatwall";

        const back = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 200), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = "back";
        
        this.receiver.subscribe("start");
        this.receiver.subscribe("porcelain");
        this.receiver.subscribe("greatwall");
        this.receiver.subscribe("back");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);


            if(event.type === "start"){
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
                this.sceneManager.changeToScene(Tutorial, {}, sceneOptions);
            }

            if(event.type === "porcelain"){
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
                this.sceneManager.changeToScene(Porcelain, {}, sceneOptions);
            }

            if(event.type === "greatwall"){
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
                this.sceneManager.changeToScene(Greatwall, {}, sceneOptions);
            }

            if(event.type === "back"){
                this.sceneManager.changeToScene(MainMenu, {});
            }

        
        }
    }

}