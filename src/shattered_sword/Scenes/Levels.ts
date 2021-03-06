
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
import Forest from "./Forest";
import Start from "./Start";
import Porcelain from "./Porcelain";
import Greatwall from './Greatwall';
import Snow from './Snow';
import Market from './Market';
import End from './End'
import InputWrapper from "../Tools/InputWrapper";
import TextInput from "../../Wolfie2D/Nodes/UIElements/TextInput";


export default class Levels extends Scene {
    private primary: Layer;
    private seedInput: TextInput;
    // TODO
    loadScene(){}
    startScene(){
        const center = this.viewport.getCenter();

        // The main menu
        this.primary = this.addUILayer("primary");


        const seedHint = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y - 400), text: "Enter seed or leave it blank to randomly generate one"});
        seedHint.textColor = Color.WHITE;
        
        this.seedInput = <TextInput>this.add.uiElement(UIElementType.TEXT_INPUT, "primary", {position: new Vec2(center.x, center.y - 350), text: ""})
        this.seedInput.size.set(200, 50);

        const start = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y - 300), text: "start(Test)"});
        start.size.set(200, 50);
        start.borderWidth = 2;
        start.borderColor = Color.WHITE;
        start.backgroundColor = Color.TRANSPARENT;
        start.onClickEventId = "start";
        
        const forest = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y - 200), text: "forest(Test)"});
        forest.size.set(200, 50);
        forest.borderWidth = 2;
        forest.borderColor = Color.WHITE;
        forest.backgroundColor = Color.TRANSPARENT;
        forest.onClickEventId = "forest";

        const porcelain = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y - 100), text: "porcelain(Test)"});
        porcelain.size.set(200, 50);
        porcelain.borderWidth = 2;
        porcelain.borderColor = Color.WHITE;
        porcelain.backgroundColor = Color.TRANSPARENT;
        porcelain.onClickEventId = "porcelain";

        const greatwall = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y), text: "greatwall(Test)"});
        greatwall.size.set(200, 50);
        greatwall.borderWidth = 2;
        greatwall.borderColor = Color.WHITE;
        greatwall.backgroundColor = Color.TRANSPARENT;
        greatwall.onClickEventId = "greatwall";

        const snow = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 100), text: "snow(Test)"});
        snow.size.set(200, 50);
        snow.borderWidth = 2;
        snow.borderColor = Color.WHITE;
        snow.backgroundColor = Color.TRANSPARENT;
        snow.onClickEventId = "snow";

        const market = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 200), text: "market(Test)"});
        market.size.set(200, 50);
        market.borderWidth = 2;
        market.borderColor = Color.WHITE;
        market.backgroundColor = Color.TRANSPARENT;
        market.onClickEventId = "market";

        const end = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 300), text: "end(Test)"});
        end.size.set(200, 50);
        end.borderWidth = 2;
        end.borderColor = Color.WHITE;
        end.backgroundColor = Color.TRANSPARENT;
        end.onClickEventId = "end";

        const back = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(center.x, center.y + 400), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = "back";
        
        this.receiver.subscribe("start");
        this.receiver.subscribe("forest");
        this.receiver.subscribe("porcelain");
        this.receiver.subscribe("greatwall");
        this.receiver.subscribe("snow");
        this.receiver.subscribe("market");
        this.receiver.subscribe("end");
        this.receiver.subscribe("back");
    }

    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            if(event.type === "start"){
                if (this.seedInput.text) {
                    InputWrapper.randomSeed = this.seedInput.text;
                    this.seedInput.text = "";
                }
                else {
                    InputWrapper.randomSeed = Math.floor(Math.random() * 10000000000).toString();
                }
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
                this.sceneManager.changeToScene(Start, {}, sceneOptions);
            }

            if(event.type === "forest"){
                if (this.seedInput.text) {
                    InputWrapper.randomSeed = this.seedInput.text;
                    this.seedInput.text = "";
                }
                else {
                    InputWrapper.randomSeed = Math.floor(Math.random() * 10000000000).toString();
                }
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

            if(event.type === "porcelain"){
                if (this.seedInput.text) {
                    InputWrapper.randomSeed = this.seedInput.text;
                    this.seedInput.text = "";
                }
                else {
                    InputWrapper.randomSeed = Math.floor(Math.random() * 10000000000).toString();
                }
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
                if (this.seedInput.text) {
                    InputWrapper.randomSeed = this.seedInput.text;
                    this.seedInput.text = "";
                }
                else {
                    InputWrapper.randomSeed = Math.floor(Math.random() * 10000000000).toString();
                }
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

            if(event.type === "snow"){
                if (this.seedInput.text) {
                    InputWrapper.randomSeed = this.seedInput.text;
                    this.seedInput.text = "";
                }
                else {
                    InputWrapper.randomSeed = Math.floor(Math.random() * 10000000000).toString();
                }
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
                this.sceneManager.changeToScene(Snow, {}, sceneOptions);
            }

            if(event.type === "market"){
                if (this.seedInput.text) {
                    InputWrapper.randomSeed = this.seedInput.text;
                    this.seedInput.text = "";
                }
                else {
                    InputWrapper.randomSeed = Math.floor(Math.random() * 10000000000).toString();
                }
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
                this.sceneManager.changeToScene(Market, {}, sceneOptions);
            }

            if(event.type === "end"){
                if (this.seedInput.text) {
                    InputWrapper.randomSeed = this.seedInput.text;
                    this.seedInput.text = "";
                }
                else {
                    InputWrapper.randomSeed = Math.floor(Math.random() * 10000000000).toString();
                }
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
                this.sceneManager.changeToScene(End, {}, sceneOptions);
            }

            if(event.type === "back"){
                this.sceneManager.changeToScene(MainMenu, {});
            }
        }
    }

}