import Scene from "./Scene/Scene";
import Rect from "./Nodes/Graphics/Rect";
import Color from "./Utils/Color";
import Vec2 from "./DataTypes/Vec2";
import UIElement from "./Nodes/UIElement";
import Button from "./Nodes/UIElements/Button";
import Layer from "./Scene/Layer";
import SecondScene from "./SecondScene";
import { GameEventType } from "./Events/GameEventType";
import SceneGraphQuadTree from "./SceneGraph/SceneGraphQuadTree";
import PlayerController from "./_DemoClasses/Player/PlayerStates/Platformer/PlayerController";

export default class MainScene extends Scene {

    loadScene(){
        this.load.tilemap("platformer", "assets/tilemaps/Platformer.json");
        this.load.tilemap("background", "assets/tilemaps/Background.json");
        this.load.image("player", "assets/sprites/player.png");
        this.load.audio("player_jump", "assets/sounds/jump-3.wav");
        //this.load.audio("level_music", "assets/sounds/level.wav");

        let loadingScreen = this.addLayer();
        let box = this.add.graphic(Rect, loadingScreen, new Vec2(200, 300), new Vec2(400, 60));
        box.setColor(new Color(0, 0, 0));
        let bar = this.add.graphic(Rect, loadingScreen, new Vec2(205, 305), new Vec2(0, 50));
        bar.setColor(new Color(0, 200, 200));

        this.load.onLoadProgress = (percentProgress: number) => {
            bar.size.x = 295 * percentProgress;
        }

        this.load.onLoadComplete = () => {
            loadingScreen.disable();
        }
    }

    startScene(){
        // Set world size
        this.worldSize = new Vec2(2560, 1280)

        // Use a quadtree
        this.sceneGraph = new SceneGraphQuadTree(this.viewport, this);

        // Add the background tilemap
        let backgroundTilemapLayer = this.add.tilemap("background", new Vec2(4, 4))[0];
        // ...and make it have parallax
        backgroundTilemapLayer.setParallax(0.5, 0.8);
        backgroundTilemapLayer.setAlpha(0.5);

        // Add the music and start playing it on a loop
        //this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});

        // Add the tilemap
        this.add.tilemap("platformer", new Vec2(4, 4));

        // Create the main game layer
        let mainLayer = this.addLayer();

        // Add a player
        let playerSprite = this.add.sprite("player", mainLayer)
        playerSprite.position.set(0, 0);
        playerSprite.size.set(64, 64);

        this.viewport.follow(playerSprite);

        // Initialize UI
        let uiLayer = this.addLayer();
        uiLayer.setParallax(0, 0);

        let recordButton = this.add.uiElement(Button, uiLayer);
        recordButton.size.set(100, 50);
        recordButton.setText("Record");
        recordButton.position.set(400, 30);
        recordButton.onClickEventId = GameEventType.START_RECORDING;

        let stopButton = this.add.uiElement(Button, uiLayer);
        stopButton.size.set(100, 50);
        stopButton.setText("Stop");
        stopButton.position.set(550, 30);
        stopButton.onClickEventId = GameEventType.STOP_RECORDING;

        let playButton = this.add.uiElement(Button, uiLayer);
        playButton.size.set(100, 50);
        playButton.setText("Play");
        playButton.position.set(700, 30);
        playButton.onClickEventId = GameEventType.PLAY_RECORDING;

        let cycleFramerateButton = this.add.uiElement(Button, uiLayer);
        cycleFramerateButton.size.set(150, 50);
        cycleFramerateButton.setText("Cycle FPS");
        cycleFramerateButton.position.set(5, 400);
        let i = 0;
        let fps = [15, 30, 60];
        cycleFramerateButton.onClick = () => {
            this.game.setMaxUpdateFPS(fps[i]);
            i = (i + 1) % 3;
        }

        // Pause Menu
        let pauseLayer = this.addLayer();
        pauseLayer.setParallax(0, 0);
        pauseLayer.disable();

        let pauseButton = this.add.uiElement(Button, uiLayer);
        pauseButton.size.set(100, 50);
        pauseButton.setText("Pause");
        pauseButton.position.set(700, 400);
        pauseButton.onClick = () => {
            this.sceneGraph.getLayers().forEach((layer: Layer) => layer.setPaused(true));
            pauseLayer.enable();
        }

        let modalBackground = this.add.uiElement(UIElement, pauseLayer);
        modalBackground.size.set(400, 200);
        modalBackground.setBackgroundColor(new Color(0, 0, 0, 0.4));
        modalBackground.position.set(200, 100);

        let resumeButton = this.add.uiElement(Button, pauseLayer);
        resumeButton.size.set(100, 50);
        resumeButton.setText("Resume");
        resumeButton.position.set(360, 150);
        resumeButton.onClick = () => {
            this.sceneGraph.getLayers().forEach((layer: Layer) => layer.setPaused(false));
            pauseLayer.disable();
        }

        let switchButton = this.add.uiElement(Button, pauseLayer);
        switchButton.size.set(140, 50);
        switchButton.setText("Change Scene");
        switchButton.position.set(340, 190);
        switchButton.onClick = () => {
            this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
            this.sceneManager.changeScene(SecondScene);
        }
    }
}