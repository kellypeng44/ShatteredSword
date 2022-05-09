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
import Levels from "./Levels";
import RandomMapGenerator from "../Tools/RandomMapGenerator";
import GameLevel from "./GameLevel";
import InputWrapper from "../Tools/InputWrapper";
import TextInput from "../../Wolfie2D/Nodes/UIElements/TextInput";
import Forest from "./Forest";
import Start from "./Start";
import PlayerController from "../Player/PlayerController";

export default class MainMenu extends Scene {
    protected config: ConfigManager;
    protected save: SaveManager;

    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private about: Layer;
    private control: Layer;
    private seedInput: TextInput;
    // private rmg: RandomMapGenerator;

    loadScene(): void {
        // Load the menu song
        this.load.image("background", "shattered_sword_assets/images/mainmenu.png");
    }

    //TODO 
    
    startScene(): void{
        GameLevel.gameTimer = 0;
        InputWrapper.randomSeed = undefined;
        const center = this.viewport.getCenter();
        PlayerController.reset();

        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");
        let background = this.add.sprite("background", "mainMenu");
        background.position.set(this.viewport.getCenter().x,this.viewport.getCenter().y);
        background.scale = new Vec2(1280/352,720/240);

        const seedHint = <Label>this.add.uiElement(UIElementType.LABEL, "mainMenu", {position: new Vec2(center.x, center.y - 220), text: "Enter seed or leave it blank to randomly generate one"});
        seedHint.textColor = Color.WHITE;
        
        this.seedInput = <TextInput>this.add.uiElement(UIElementType.TEXT_INPUT, "mainMenu", {position: new Vec2(center.x, center.y - 170), text: ""})
        this.seedInput.size.set(200, 50);

        // Add map button, and give it an event to emit on press
        const map = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 80), text: "Start Game"});
        map.size.set(200, 50);
        map.borderWidth = 2;
        map.borderColor = Color.WHITE;
        map.backgroundColor = Color.TRANSPARENT;
        map.onClickEventId = "map";


        // Add about button
        const about = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "About"});
        about.size.set(200, 50);
        about.borderWidth = 2;
        about.borderColor = Color.WHITE;
        about.backgroundColor = Color.TRANSPARENT;
        about.onClickEventId = "about";

        // Add about button
        const form = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 200), text: "Google Form"});
        form.size.set(200, 50);
        form.borderWidth = 2;
        form.borderColor = Color.WHITE;
        form.backgroundColor = Color.TRANSPARENT;
        form.onClick = function() {
            window.open("https://forms.gle/Ku7RmUdNn7b9m5ch6");
        };
        
        // Add control button, and give it an event to emit on press
        const control = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Controls"});
        control.size.set(200, 50);
        control.borderWidth = 2;
        control.borderColor = Color.WHITE;
        control.backgroundColor = Color.TRANSPARENT;
        control.onClickEventId = "control";

        /* ########## ABOUT SCREEN ########## */
        this.about = this.addUILayer("about");
        this.about.setHidden(true);

        const aboutHeader = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 250), text: "About"});
        aboutHeader.textColor = Color.WHITE;

        
        const text1 = "This game was created by Henry Chen, Kelly Peng, and Renge";
        const text2 = "using the Wolfie2D game engine, a TypeScript game engine created by";
        const text3 = "Joe Weaver and Richard McKenna.";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y - 50), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "about", {position: new Vec2(center.x, center.y + 50), text: text3});

        line1.textColor = Color.WHITE;
        line2.textColor = Color.WHITE;
        line3.textColor = Color.WHITE;

        const aboutBack = this.add.uiElement(UIElementType.BUTTON, "about", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        aboutBack.size.set(200, 50);
        aboutBack.borderWidth = 2;
        aboutBack.borderColor = Color.WHITE;
        aboutBack.backgroundColor = Color.TRANSPARENT;
        aboutBack.onClickEventId = "menu";

        // Subscribe to the button events
        this.receiver.subscribe("map");
        this.receiver.subscribe("about");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("control");

       
        //Control screen
        this.control = this.addUILayer("control");
        this.control.setHidden(true);

    
        
        const header = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 250), text: "Controls"});
        header.textColor = Color.WHITE;
        const lc = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 150), text: "A/D - Move Left/Right"});
        lc.textColor = Color.WHITE;
        const rc = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 100), text: "W/S - Look Up/Down"});
        rc.textColor = Color.WHITE;
        const wasd = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y - 50), text: "J/Z/Enter - Attack"});
        wasd.textColor = Color.WHITE;
        
        const e = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y), text: "SPACE/X - Jump"});
        e.textColor = Color.WHITE;
        const q = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 50), text: "K/C - Dash"});
        q.textColor = Color.WHITE;
        //const oneTwo = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 100), text: "L/V - Use Skill"});
        const oneTwo = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 100), text: ""});
        oneTwo.textColor = Color.WHITE
        //const zx = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 150), text: "I/B - open Backpack"});
        const zx = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 150), text: ""});
        zx.textColor = Color.WHITE;
        const tb = <Label>this.add.uiElement(UIElementType.LABEL, "control", {position: new Vec2(center.x, center.y + 200), text: "ESC - Pause"});
        tb.textColor = Color.WHITE;

        const back = this.add.uiElement(UIElementType.BUTTON, "control", {position: new Vec2(center.x, center.y + 300), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = "menu";
        
    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        //this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
    }

    
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();

            console.log(event);

            // if(event.type === "map"){
            //     this.sceneManager.changeToScene(Levels, {});
            // }

            if(event.type === "map"){
                if (this.seedInput.text) {
                    InputWrapper.randomSeed = this.seedInput.text;
                    this.seedInput.text = "";
                }
                else {
                    InputWrapper.randomSeed = Math.floor(Math.random() * 10000000000).toString();
                }
                console.log(InputWrapper.randomSeed);
                if (InputWrapper.randomSeed.toLowerCase() === "levels") {
                    this.sceneManager.changeToScene(Levels, {});
                }
                else {
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
            }

            if(event.type === "about"){
                this.about.setHidden(false);
                this.mainMenu.setHidden(true);
            }

            if(event.type === "menu"){
                this.mainMenu.setHidden(false);
                this.about.setHidden(true);
                this.control.setHidden(true);
            }
            if(event.type === "control"){
                this.mainMenu.setHidden(true);
                this.control.setHidden(false);
            }

        }
    }
}
