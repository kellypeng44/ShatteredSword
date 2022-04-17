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
import InputWrapper from "../Tools/InputWrapper";


export default class MainMenu extends Scene {
    protected config: ConfigManager;
    protected save: SaveManager;

    animatedSprite: AnimatedSprite;
    clickLabel: Label;

    loadScene(): void {
        //load images
        //this.load.image("logo", "shattered_sword_assets/images/Shattered_Sword_Logo.png");
        //this.load.image("backgroundImage", "shattered_sword_assets/images/Background.png");
        // Load the menu song
        //this.load.audio("menu", "assets/music/menu.mp3");
    }

    //TODO 
    
    startScene(): void{
        this.config = new ConfigManager();
        this.save = new SaveManager();


        // Scene has started, so start playing music
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});

        const center = this.viewport.getCenter();

        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        let backgroundLayer = this.addUILayer("background");
        backgroundLayer.setDepth(0);
        let frontLayer = this.addUILayer("frontground");
        frontLayer.setDepth(1);

        this.clickLabel = <Label>this.add.uiElement(UIElementType.LABEL, "frontground", {position: new Vec2(size.x, size.y + 300), text: "\"Click anywhere to start\""});
        this.clickLabel.textColor = new Color(0, 0, 0, 1);
        this.clickLabel.font = "Arial";
        this.clickLabel.fontSize = 70;

        let background = this.add.sprite("backgroundImage", "background");
        background.position.set(size.x, size.y);

        let logo = this.add.sprite("logo", "frontground");
        logo.position.set(size.x, size.y + 20);
        logo.scale.set(4, 4); 

    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        //this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
    }

    
    updateScene(){
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            console.log(event);
            if (InputWrapper.isLeftMouseJustPressed()) {  //if left click
                this.sceneManager.changeToScene(MainMenu, {}, {});
                
            }

        }
    }
}
