import Scene from "./Scene/Scene";
import OrthogonalTilemap from "./Nodes/Tilemaps/OrthogonalTilemap";
import Player from "./Player";
import Rect from "./Nodes/Graphics/Rect";
import Color from "./Utils/Color";
import Vec2 from "./DataTypes/Vec2";
import UIElement from "./Nodes/UIElement";
import Button from "./Nodes/UIElements/Button";
import Layer from "./Scene/Layer";

export default class MainScene extends Scene {

    loadScene(){
        this.load.tilemap("platformer", "assets/tilemaps/Platformer.json");
        this.load.tilemap("background", "assets/tilemaps/Background.json");
    }

    startScene(){
        // Add the background tilemap
        let backgroundTilemap = this.add.tilemap("background", OrthogonalTilemap)[0];
        // ...and make it have parallax
        backgroundTilemap.getLayer().setParallax(0.5, 0.8);
        backgroundTilemap.getLayer().setAlpha(0.5);

        // Add the tilemap
        this.add.tilemap("platformer", OrthogonalTilemap);

        // Create the main game layer
        let mainLayer = this.addLayer();

        // Add a player
        let player = this.add.physics(Player, mainLayer, "platformer");
        let playerSprite = this.add.graphic(Rect, mainLayer, new Vec2(0, 0), new Vec2(50, 50));
        playerSprite.setColor(new Color(255, 0, 0));
        player.setSprite(playerSprite);


        this.viewport.follow(player);

        // Initialize UI
        let uiLayer = this.addLayer();
        uiLayer.setParallax(0, 0);

        let recordButton = this.add.uiElement(Button, uiLayer);
        recordButton.setSize(100, 50);
        recordButton.setText("Record");
        recordButton.setPosition(400, 30);
        recordButton.onClickEventId = "record_button_press";

        let stopButton = this.add.uiElement(Button, uiLayer);
        stopButton.setSize(100, 50);
        stopButton.setText("Stop");
        stopButton.setPosition(550, 30);
        stopButton.onClickEventId = "stop_button_press";

        let playButton = this.add.uiElement(Button, uiLayer);
        playButton.setSize(100, 50);
        playButton.setText("Play");
        playButton.setPosition(700, 30);
        playButton.onClickEventId = "play_button_press";

        let cycleFramerateButton = this.add.uiElement(Button, uiLayer);
        cycleFramerateButton.setSize(150, 50);
        cycleFramerateButton.setText("Cycle FPS");
        cycleFramerateButton.setPosition(5, 400);
        let i = 0;
        let fps = [15, 30, 60];
        cycleFramerateButton.onClick = () => {
            this.game.setMaxFPS(fps[i]);
            i = (i + 1) % 3;
        }

        // Pause Menu
        let pauseLayer = this.addLayer();
        pauseLayer.setParallax(0, 0);
        pauseLayer.disable();

        let pauseButton = this.add.uiElement(Button, uiLayer);
        pauseButton.setSize(100, 50);
        pauseButton.setText("Pause");
        pauseButton.setPosition(700, 400);
        pauseButton.onClick = () => {
            this.layers.forEach((layer: Layer) => layer.setPaused(true));
            pauseLayer.enable();
        }

        let modalBackground = this.add.uiElement(UIElement, pauseLayer);
        modalBackground.setSize(400, 200);
        modalBackground.setBackgroundColor(new Color(0, 0, 0, 0.4));
        modalBackground.setPosition(200, 100);

        let resumeButton = this.add.uiElement(Button, pauseLayer);
        resumeButton.setSize(100, 50);
        resumeButton.setText("Resume");
        resumeButton.setPosition(400, 200);
        resumeButton.onClick = () => {
            this.layers.forEach((layer: Layer) => layer.setPaused(false));
            pauseLayer.disable();
        }
    }
}